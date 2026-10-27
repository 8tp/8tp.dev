/**
 * Warren. A meadow seen from straight above: rabbits graze in loose groups
 * around their burrows while a red-tailed hawk circles on a thermal. When it
 * gets hungry it picks out a straggler and stoops, shrinking as it drops away
 * from you toward the grass while its shadow slides in to meet it. The
 * rabbits never get caught. One that sees the hawk flashes its white tail
 * and thumps, the alarm runs through the warren, and they all bunnyhop for
 * home: zig-zag hops that gain speed with every one they chain, which is
 * also what spoils the hawk's aim.
 *
 * Grass shows the wind as gusts rolling across it, and lies flat where
 * rabbits have run before slowly springing back. The cursor counts as a
 * threat; a tap plants clover, and the calm rabbits nearby come to graze.
 *
 * Built after studying ascii-sharks (@stackedlol): an artificial-life sim
 * with alarm that spreads from neighbour to neighbour, a predator that goes
 * for stragglers, bodies supersampled per cell into solid blocks and soft
 * edge glyphs, glyphs keyed to the body so the texture rides with it, a
 * shadow on the ground, and a decaying field for disturbance (here, dust and
 * trampled grass).
 */
import { put, block, stamp, stroke, rng, code, hash3, type Cells, type Pointer, type Scene } from "./engine";

/* Palette indices. Keep in step with `palette` below. */
const GRASS = 1, GRASS_DARK = 2, GRASS_LIT = 3, TRAMPLE = 4;
const DIRT = 5, HOLE = 6, CLOVER = 7, BLOOM_Y = 8, BLOOM_W = 9, BLOOM_P = 10;
const RABBIT = 11, RABBIT_DARK = 12, TAIL = 13;
const HAWK = 14, HAWK_DARK = 15, HAWK_TAIL = 16, HAWK_PALE = 17, BEAK = 18;
const SHADOW = 19, DUST = 20;

type State = "graze" | "alert" | "flee" | "hidden";

type Rabbit = {
  x: number;
  y: number;
  heading: number;
  state: State;
  /** 0 calm .. 1 bolting. Passed on to neighbours. */
  alarm: number;
  /** Seconds left in the current hop; 0 on the ground. */
  air: number;
  hop: number;
  speed: number;
  /** Hops chained without stopping. Each one adds speed. */
  chain: number;
  strafe: 1 | -1;
  /** Ground time left before the next hop, or time left underground. */
  wait: number;
  burrow: number;
  /** A binky: a happy jump and twist in place. */
  binky: boolean;
  id: number;
};

type Hawk = {
  x: number;
  y: number;
  heading: number;
  speed: number;
  /** 1 high (near the viewer, big) .. 0 at the grass. */
  altitude: number;
  mode: "soar" | "stoop" | "climb";
  hunger: number;
  /** Turn rate, smoothed; it banks into turns. */
  turn: number;
  flap: number;
  thermal: { x: number; y: number; dir: 1 | -1; r: number };
  target: Rabbit | null;
};

type Burrow = { x: number; y: number };
type Clover = { x: number; y: number; left: number };

const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/* Sub-cell sample offsets, centre first. */
const SAMPLES = [0.5, 0.5, 0.25, 0.3, 0.75, 0.3, 0.25, 0.72, 0.75, 0.72];

const BLADES = ",'`.\"";
const MOTTLE = ":;+*x%#@";
const EDGE_LIGHT = ".'`,";
const EDGE_HEAVY = ":;";

export const warren: Scene = {
  font: 9,
  leading: 1.3,
  weight: 600,
  fps: 30,
  peak: [0.7, 0.72],
  underText: 0.3,
  palette: {
    light: [
      "#7da35a", // grass
      "#4f7f3a", // grass, dark
      "#b5c96a", // grass in a gust
      "#c2b46c", // trampled
      "#9b7448", // dirt
      "#2d2219", // burrow mouth
      "#3f8f3a", // clover
      "#e0b21c", // dandelion
      "#a9b0b8", // daisy
      "#d9709a", // clover flower
      "#8c6c52", // rabbit
      "#5c4535", // rabbit, dark
      "#f4efe6", // tail
      "#7a5233", // hawk back
      "#3d2a1c", // hawk, dark
      "#c4572c", // red tail
      "#d8c3a0", // hawk, pale mottling
      "#d6a12a", // beak and cere
      "#5d6b4f", // shadow
      "#b8a27a", // dust
    ],
    dark: [
      "#4f7a54",
      "#2f5238",
      "#8fb38a",
      "#7d7f62",
      "#7a5f45",
      "#050605",
      "#5aa35a",
      "#ffd23f",
      "#e6ecf2",
      "#ff8fb8",
      "#5f4e42", // at night the fur is the dark block and the lines are pale
      "#f1e4d4",
      "#ffffff",
      "#c9b49a", // at night the hawk reads paler, like an owl in moonlight
      "#7a6656",
      "#e08a5a",
      "#efe3cf",
      "#f2c45a",
      "#000000",
      "#9a8a6a",
    ],
  },

  create(cells: Cells, width: number, height: number) {
    const { cols, rows, cw, ch } = cells;
    const random = rng(17);
    const minSide = Math.min(width, height);

    /* ------------------------------------------------------------ fields */

    /* Trampled grass springs back slowly; dust settles fast. */
    const trample = new Float32Array(cols * rows);
    let dust = new Float32Array(cols * rows);
    let spare = new Float32Array(cols * rows);

    const deposit = (field: Float32Array, x: number, y: number, amount: number, radius = 0) => {
      const c0 = Math.floor(x / cw), r0 = Math.floor(y / ch);
      for (let r = r0 - radius; r <= r0 + radius; r++) {
        for (let c = c0 - radius * 2; c <= c0 + radius * 2; c++) {
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const d = Math.hypot((c - c0) * (cw / ch), r - r0) / (radius + 0.6);
          if (d > 1) continue;
          const i = r * cols + c;
          field[i] = Math.min(1.5, field[i] + amount * (1 - d));
        }
      }
    };

    const settle = (dt: number) => {
      const decay = Math.exp(-dt * 2.2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const l = c > 0 ? dust[i - 1] : dust[i];
          const rt = c < cols - 1 ? dust[i + 1] : dust[i];
          const u = r > 0 ? dust[i - cols] : dust[i];
          const d = r < rows - 1 ? dust[i + cols] : dust[i];
          spare[i] = (dust[i] * 4 + l + rt + u + d) * 0.125 * decay;
        }
      }
      [dust, spare] = [spare, dust];
      const regrow = Math.exp(-dt * 0.18);
      for (let i = 0; i < trample.length; i++) trample[i] *= regrow;
    };

    /* ---------------------------------------------------------- burrows */

    /* Mostly in the margins and along the foot of the page, out from under the copy. */
    const burrows: Burrow[] = [];
    const sites = width > 760
      ? [[0.07, 0.3], [0.1, 0.72], [0.92, 0.22], [0.9, 0.62], [0.5, 0.94], [0.28, 0.88], [0.74, 0.9]]
      : [[0.15, 0.85], [0.5, 0.92], [0.85, 0.8], [0.2, 0.15], [0.8, 0.2]];
    for (const [fx, fy] of sites) burrows.push({ x: width * fx + (random() - 0.5) * 30, y: height * fy + (random() - 0.5) * 20 });

    /* --------------------------------------------------------- rabbits */

    const total = clamp(Math.round((width * height) / 26000), 16, 52);
    const rabbits: Rabbit[] = Array.from({ length: total }, (_, id) => {
      const home = id % burrows.length;
      const b = burrows[home];
      const a = random() * Math.PI * 2, d = 40 + random() * 110;
      return {
        x: b.x + Math.cos(a) * d * 1.4,
        y: b.y + Math.sin(a) * d * 0.7,
        heading: random() * Math.PI * 2,
        state: "graze",
        alarm: 0,
        air: 0,
        hop: 0.18,
        speed: 0,
        chain: 0,
        strafe: random() < 0.5 ? 1 : -1,
        wait: random() * 3,
        burrow: home,
        binky: false,
        id,
      };
    });

    const clover: Clover[] = [];

    /* ------------------------------------------------------------- hawk */

    const span = clamp(minSide * 0.3, 150, 270); // half-span at full height
    const thermal = () => ({
      /* Thermals rise over the margins, so it circles beside the copy, not on it. */
      x: width > 900 ? width * (random() < 0.5 ? 0.1 + random() * 0.06 : 0.84 + random() * 0.06) : width * (0.3 + random() * 0.4),
      y: height * (0.3 + random() * 0.4),
      dir: (random() < 0.5 ? 1 : -1) as 1 | -1,
      r: minSide * (0.12 + random() * 0.06),
    });
    const hawk: Hawk = {
      x: width * 0.3,
      y: height * 0.4,
      heading: 0,
      speed: 70,
      altitude: 1,
      mode: "soar",
      hunger: 0.2,
      turn: 0,
      flap: 0,
      thermal: thermal(),
      target: null,
    };

    let clock = 0;

    /** Where the hawk's shadow falls: offset by height, the sun low in the south-west. */
    const shadowAt = () => ({ x: hawk.x + hawk.altitude * minSide * 0.22, y: hawk.y + hawk.altitude * minSide * 0.14 });
    /** On-screen size: big when high (near the viewer), smaller as it drops. */
    const scaleOf = (altitude: number) => 0.5 + 0.5 * altitude;

    const stepHawk = (dt: number) => {
      hawk.hunger = Math.min(1, hawk.hunger + dt * 0.045);
      let want = hawk.heading;

      if (hawk.mode === "soar") {
        /* Circle the thermal, which drifts with the wind. */
        const t = hawk.thermal;
        t.x += Math.sin(clock * 0.05) * 6 * dt;
        const rx = hawk.x - t.x, ry = hawk.y - t.y;
        const r = Math.hypot(rx, ry) || 1;
        const radial = clamp((t.r - r) / t.r, -1, 1);
        want = Math.atan2(ry, rx) + t.dir * (Math.PI / 2) - t.dir * radial * 0.8;
        hawk.speed += (70 - hawk.speed) * dt;
        hawk.altitude = Math.min(1, hawk.altitude + dt * 0.2);
        if (random() < dt * 0.04) hawk.thermal = thermal();

        /* Hungry: pick the rabbit out in the open, furthest from its friends and its hole. */
        if (hawk.hunger > 0.75) {
          let best: Rabbit | null = null, score = -Infinity;
          for (const rb of rabbits) {
            if (rb.state === "hidden") continue;
            let crowd = 0;
            for (const o of rabbits) if (o !== rb && o.state !== "hidden" && Math.hypot(o.x - rb.x, o.y - rb.y) < 70) crowd++;
            const home = Math.hypot(burrows[rb.burrow].x - rb.x, burrows[rb.burrow].y - rb.y);
            const s = home * 0.6 - crowd * 40 - Math.hypot(rb.x - hawk.x, rb.y - hawk.y) * 0.4;
            if (s > score) (score = s), (best = rb);
          }
          if (best) {
            hawk.target = best;
            hawk.mode = "stoop";
          }
        }
      } else if (hawk.mode === "stoop") {
        const t = hawk.target;
        if (!t || t.state === "hidden") {
          hawk.mode = "climb";
        } else {
          /* Lead the target, which is exactly what the zig-zag defeats. */
          const lead = t.air > 0 ? 0.25 : 0;
          const tx = t.x + Math.cos(t.heading) * t.speed * lead, ty = t.y + Math.sin(t.heading) * t.speed * lead;
          want = Math.atan2(ty - hawk.y, tx - hawk.x);
          hawk.speed += (230 - hawk.speed) * dt * 1.5;
          hawk.altitude = Math.max(0, hawk.altitude - dt * 0.42);
          const d = Math.hypot(t.x - hawk.x, t.y - hawk.y);
          if (hawk.altitude < 0.08) {
            /* The strike: a burst of dust, and the rabbit is already gone. */
            deposit(dust, hawk.x, hawk.y, 1.4, 3);
            deposit(trample, hawk.x, hawk.y, 1, 2);
            if (d < 60) {
              t.alarm = 1;
              t.strafe = t.strafe === 1 ? -1 : 1;
              t.heading += t.strafe * Math.PI * 0.5;
            }
            hawk.mode = "climb";
            hawk.hunger = 0;
          }
        }
      } else {
        want = hawk.heading + 0.3;
        hawk.speed += (110 - hawk.speed) * dt;
        hawk.altitude = Math.min(1, hawk.altitude + dt * 0.22);
        hawk.flap += dt * 9;
        if (hawk.altitude > 0.97) {
          hawk.mode = "soar";
          hawk.target = null;
          hawk.thermal = thermal();
        }
      }

      /* Stay over the meadow. */
      const m = 60;
      if (hawk.x < -m || hawk.x > width + m || hawk.y < -m || hawk.y > height + m) {
        want = Math.atan2(height / 2 - hawk.y, width / 2 - hawk.x);
      }

      const agility = hawk.mode === "stoop" ? 2.6 : 1.1;
      const turned = clamp(wrap(want - hawk.heading), -agility * dt, agility * dt);
      hawk.heading = wrap(hawk.heading + turned);
      hawk.turn += (turned / dt - hawk.turn) * Math.min(1, dt * 3);
      /* Soaring, it rests on open wings and gives a few beats now and then. */
      if (hawk.mode === "soar") hawk.flap = Math.sin(clock * 0.3) > 0.85 ? hawk.flap + dt * 7 : Math.PI / 2;
      hawk.x += Math.cos(hawk.heading) * hawk.speed * dt;
      hawk.y += Math.sin(hawk.heading) * hawk.speed * dt;
    };

    const stepRabbits = (dt: number, pointer: Pointer) => {
      const sh = shadowAt();
      const fearR = 140 + (1 - hawk.altitude) * 220;
      const fast = Math.hypot(pointer.vx, pointer.vy);

      for (const rb of rabbits) {
        if (rb.state === "hidden") {
          if ((rb.wait -= dt) <= 0) {
            rb.state = "alert";
            rb.alarm = 0.35;
            rb.wait = 1.5 + random() * 2;
            rb.x = burrows[rb.burrow].x;
            rb.y = burrows[rb.burrow].y;
          }
          continue;
        }

        /* What it can see: the hawk coming down, its shadow, the cursor. */
        let fear = 0;
        let fromX = 0, fromY = 0;
        if (hawk.mode === "stoop" || hawk.altitude < 0.85) {
          const d = Math.hypot(rb.x - hawk.x, rb.y - hawk.y);
          if (d < fearR) {
            const f = 1 - d / fearR;
            if (f > fear) (fear = f + 0.3), (fromX = hawk.x), (fromY = hawk.y);
          }
        }
        const ds = Math.hypot(rb.x - sh.x, rb.y - sh.y);
        if (ds < span * 0.5 * scaleOf(0)) {
          const f = 0.5 * (1 - ds / (span * 0.5));
          if (f > fear) (fear = f), (fromX = sh.x), (fromY = sh.y);
        }
        if (pointer.inside) {
          const d = Math.hypot(rb.x - pointer.x, rb.y - pointer.y);
          const reach = fast > 200 ? 150 : 55;
          if (d < reach) {
            const f = (1 - d / reach) * (fast > 200 ? 1 : 0.5);
            if (f > fear) (fear = f), (fromX = pointer.x), (fromY = pointer.y);
          }
        }

        /* Thumps carry alarm to neighbours, a little weaker each time. */
        let heard = 0;
        for (const o of rabbits) {
          if (o === rb || o.state === "hidden") continue;
          if (Math.abs(o.x - rb.x) < 90 && Math.abs(o.y - rb.y) < 90) heard = Math.max(heard, o.alarm * 0.85);
        }
        rb.alarm = Math.max(rb.alarm * Math.exp(-dt * 0.35), Math.min(1, fear));
        if (heard > rb.alarm) rb.alarm += (heard - rb.alarm) * Math.min(1, dt * 4);

        if (rb.alarm > 0.62 && rb.state !== "flee") {
          rb.state = "flee";
          rb.chain = 0;
          /* The nearest hole that isn't toward the threat. */
          let best = rb.burrow, score = Infinity;
          burrows.forEach((b, i) => {
            const d = Math.hypot(b.x - rb.x, b.y - rb.y);
            const toward = fromX || fromY ? Math.hypot(b.x - fromX, b.y - fromY) : 1e9;
            const s = d + (toward < d ? 400 : 0);
            if (s < score) (score = s), (best = i);
          });
          rb.burrow = best;
          rb.wait = 0;
        } else if (rb.state === "graze" && rb.alarm > 0.3) {
          rb.state = "alert";
          rb.wait = 1 + random() * 1.5;
        }

        /* In the air: move. */
        if (rb.air > 0) {
          rb.air -= dt;
          rb.x += Math.cos(rb.heading) * rb.speed * dt;
          rb.y += Math.sin(rb.heading) * rb.speed * dt;
          if (rb.air <= 0) {
            rb.air = 0;
            deposit(trample, rb.x, rb.y, rb.state === "flee" ? 0.5 : 0.12, 0);
            if (rb.state === "flee") deposit(dust, rb.x, rb.y, 0.35, 0);
            rb.binky = false;
          }
          continue;
        }

        /* On the ground: wait, then hop. */
        rb.wait -= dt;
        if (rb.wait > 0) continue;

        if (rb.state === "flee") {
          const b = burrows[rb.burrow];
          const d = Math.hypot(b.x - rb.x, b.y - rb.y);
          if (d < 9) {
            rb.state = "hidden";
            rb.wait = 7 + random() * 9;
            rb.alarm = 0;
            continue;
          }
          /* Bunnyhop: strafe left, then right, a bit faster each hop. */
          rb.chain++;
          rb.strafe = rb.strafe === 1 ? -1 : 1;
          const swing = 0.55 * clamp(d / 90);
          rb.heading = Math.atan2(b.y - rb.y, b.x - rb.x) + rb.strafe * swing;
          rb.speed = Math.min(330, 120 * Math.pow(1.12, rb.chain));
          rb.hop = Math.min(0.22, (d / rb.speed) * 1.05 + 0.04);
          rb.air = rb.hop;
          rb.wait = 0.03;
          continue;
        }

        if (rb.state === "alert") {
          rb.state = rb.alarm < 0.25 ? "graze" : "alert";
          rb.wait = 0.6 + random();
          continue;
        }

        /* Grazing: a short hop now and then, toward company, food and home. */
        let ax = 0, ay = 0;
        for (const o of rabbits) {
          if (o === rb || o.state === "hidden") continue;
          const dx = o.x - rb.x, dy = o.y - rb.y;
          const d = Math.hypot(dx, dy);
          /* Personal space is about one rabbit wide, measured in sprite cells. */
          const q = Math.hypot(dx / (cw * 6.5), dy / (ch * 2.6));
          if (q < 1 && d > 0) (ax -= (dx / d) * 3 * (1 - q) * 2), (ay -= (dy / d) * 3 * (1 - q) * 2);
          else if (d < 140) (ax += dx / d / 6), (ay += dy / d / 6);
        }
        const b = burrows[rb.burrow];
        const home = Math.hypot(b.x - rb.x, b.y - rb.y);
        if (home > 140) (ax += ((b.x - rb.x) / home) * 1.2), (ay += ((b.y - rb.y) / home) * 1.2);
        for (const c of clover) {
          const d = Math.hypot(c.x - rb.x, c.y - rb.y);
          if (d < 320 && d > 6) (ax += ((c.x - rb.x) / d) * 2.5), (ay += ((c.y - rb.y) / d) * 2.5);
          if (d < 14) c.left -= dt * 0.6;
        }
        const a = Math.atan2(ay, ax) + (random() - 0.5) * 1.6;
        rb.heading = ax || ay ? a : random() * Math.PI * 2;
        rb.binky = random() < 0.04;
        rb.speed = rb.binky ? 0 : 55 + random() * 25;
        rb.hop = rb.binky ? 0.35 : 0.18;
        rb.air = rb.hop;
        rb.wait = 0.5 + random() * 2.4;
        rb.chain = 0;
        rb.x = clamp(rb.x, 6, width - 6);
        rb.y = clamp(rb.y, 6, height - 6);
      }
    };

    /* -------------------------------------------------------- the hawk, drawn */

    /** Hawk body coordinates for a point: u forward, v to the right, in half-spans. */
    const hit = { kind: 0, shade: 0, u: 0, v: 0, angle: 0, feather: 0.5, bar: false };
    // kinds: 1 back, 2 covert, 3 flight feather, 4 primary tip, 5 tail, 6 head, 7 beak

    const sampleHawk = (px: number, py: number, scale: number, spreadL: number, spreadR: number, tuck: number) => {
      const H = span * scale;
      const dx = Math.cos(hawk.heading), dy = Math.sin(hawk.heading);
      const rx = px - hawk.x, ry = py - hawk.y;
      const u = (rx * dx + ry * dy) / H, v = (rx * -dy + ry * dx) / H;
      hit.u = u;
      hit.v = v;

      /* Head and beak. */
      const hu = u - 0.3, hd = Math.hypot(hu / 0.08, v / 0.07);
      if (hd < 1) {
        hit.kind = 6;
        hit.shade = 0.35 + 0.3 * hd;
        return true;
      }
      if (u > 0.36 && u < 0.43 && Math.abs(v) < 0.025 * (1 - (u - 0.36) / 0.07)) {
        hit.kind = 7;
        hit.shade = 0.3;
        return true;
      }
      /* Body. */
      const bd = Math.hypot((u - 0.02) / 0.3, v / 0.09);
      if (bd < 1) {
        hit.kind = 1;
        hit.shade = 0.3 + 0.55 * bd;
        return true;
      }
      /* Tail: a fan, wider at the end, rounded. */
      if (u < -0.2 && u > -0.58) {
        const w = 0.06 + ((-0.2 - u) / 0.38) * 0.11 * (1 - tuck * 0.5);
        const end = -0.58 + 0.05 * (Math.abs(v) / w) ** 2;
        if (Math.abs(v) < w && u > end) {
          hit.kind = 5;
          /* A dark band near the tip, as a red-tail has. */
          hit.shade = u < -0.52 ? 0.85 : 0.35 + 0.3 * (Math.abs(v) / w);
          return true;
        }
      }
      /* Wings. */
      const spread = (v < 0 ? spreadL : spreadR) * (1 - tuck * 0.45);
      const t = (Math.abs(v) - 0.05) / spread;
      if (t < 0 || t > 1) return false;
      /* The leading edge runs forward to the wrist, then sweeps back to the
         tip; the trailing edge rises toward the hand, so the wing narrows. */
      const wrist = smoothstep(0, 0.42, t), hand = smoothstep(0.42, 1, t);
      const lead = 0.1 + 0.07 * wrist - 0.24 * hand ** 1.3 - tuck * 0.08 * t;
      let trail = -0.17 - 0.02 * t + 0.2 * hand ** 1.6;
      /* Fingered primaries at the tip: five slotted feathers. */
      const finger = t > 0.72;
      if (finger) {
        const slot = Math.sin(((t - 0.72) / 0.28) * Math.PI * 5);
        trail = lead - (lead - trail) * (slot > -0.2 ? 1 : 0.3);
      }
      /* Scalloped trailing edge on the secondaries. */
      trail += 0.012 * Math.sin(t * 40);
      if (u > lead || u < trail) return false;
      const across = (lead - u) / Math.max(0.01, lead - trail);
      hit.kind = finger ? 4 : across > 0.42 ? 3 : 2;
      hit.shade = finger ? 0.8 : across > 0.42 ? 0.5 + 0.3 * across : 0.25 + 0.4 * across;
      /* Feather boundaries and the dark bars across the flight feathers. */
      hit.feather = (t * 18) % 1;
      hit.bar = Math.sin(across * 22) > 0.55;
      /* Feathers sweep back and out. */
      hit.angle = hawk.heading + Math.PI + (v < 0 ? -1 : 1) * (0.35 + t * 0.5);
      return true;
    };

    const drawHawkShape = (cells: Cells, shadow: boolean) => {
      const scale = shadow ? scaleOf(0) : scaleOf(hawk.altitude);
      const bank = clamp(hawk.turn * 0.3, -0.3, 0.3);
      const wing = 0.86 + 0.14 * Math.sin(hawk.flap);
      const tuck = hawk.mode === "stoop" ? clamp(1 - hawk.altitude * 1.2) : 0;
      const spreadL = wing * (1 + bank), spreadR = wing * (1 - bank);

      const saved = { x: hawk.x, y: hawk.y };
      if (shadow) {
        const s = shadowAt();
        hawk.x = s.x;
        hawk.y = s.y;
      }
      const reach = span * scale * 1.1;
      const c0 = Math.max(0, Math.floor((hawk.x - reach) / cw)), c1 = Math.min(cols - 1, Math.ceil((hawk.x + reach) / cw));
      const r0 = Math.max(0, Math.floor((hawk.y - reach) / ch)), r1 = Math.min(rows - 1, Math.ceil((hawk.y + reach) / ch));
      const dim = 0.75 + 0.25 * hawk.altitude;

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          let hits = 0, kind = 0, shade = 0, u = 0, v = 0, angle = 0, feather = 0.5, bar = false;
          for (let s = 0; s < SAMPLES.length; s += 2) {
            if (!sampleHawk((c + SAMPLES[s]) * cw, (r + SAMPLES[s + 1]) * ch, scale, spreadL, spreadR, tuck)) continue;
            if (hits === 0 || s === 0) ({ kind, shade, u, v, angle, feather, bar } = hit);
            hits++;
          }
          if (!hits) continue;
          const coverage = hits / 5;

          if (shadow) {
            put(cells, c, r, code(coverage > 0.6 ? ":" : "."), 0.3 + coverage * 0.25, SHADOW);
            block(cells, c, r, SHADOW, 0.18 * coverage);
            continue;
          }

          const key = hash3(Math.round(u * 40), Math.round(v * 30), 5);
          if (coverage < 0.6) {
            const set = coverage >= 0.4 ? EDGE_HEAVY : EDGE_LIGHT;
            put(cells, c, r, code(set[Math.floor(key * set.length)]), (0.5 + coverage * 0.4) * dim, HAWK_DARK);
            continue;
          }

          let color = HAWK, under = HAWK, glyph: number;
          if (kind === 7) {
            color = BEAK;
            under = BEAK;
            glyph = code(">");
          } else if (kind === 6) {
            color = HAWK_DARK;
            glyph = code(MOTTLE[Math.floor(shade * 7.99)]);
          } else if (kind === 5) {
            color = shade > 0.8 ? HAWK_DARK : HAWK_TAIL;
            under = HAWK_TAIL;
            glyph = stroke(hawk.heading + Math.PI + v * 1.5);
          } else if (kind === 3 || kind === 4) {
            /* Flight feathers: drawn along their own direction, split at each
               feather's edge, and barred across. */
            const edge = feather < 0.2;
            color = kind === 4 || edge || bar ? HAWK_DARK : HAWK;
            under = kind === 4 ? HAWK_DARK : HAWK;
            glyph = edge ? code(":") : stroke(angle);
          } else {
            /* Back and coverts: mottled, with pale feather edges here and there. */
            color = key > 0.78 ? HAWK_PALE : HAWK;
            const jitter = Math.floor(key * 3) - 1;
            glyph = code(MOTTLE[clamp(Math.floor(shade * 7.99) + jitter, 0, MOTTLE.length - 1)]);
          }
          put(cells, c, r, glyph, (0.6 + shade * 0.4) * dim, color);
          block(cells, c, r, under, (0.42 + shade * 0.3) * dim);
        }
      }
      hawk.x = saved.x;
      hawk.y = saved.y;
    };

    /* --------------------------------------------------- rabbits, drawn */

    /*
     * A rabbit is a two-row bunny, five cells wide: ears over a face. It's
     * drawn face-on whichever way it's going, the way a rabbit reads at this
     * size, except when it bolts: then you see its back and the white tail,
     * which is the alarm signal the others are reacting to.
     */
    const FACES: Record<string, [string, string]> = {
      graze: ["(\\_/)", "(-.-)"],
      alert: ["(\\_/)", "(o.o)"],
      flee: ["(\\_/)", "( o )"],
      binky: ["(/_\\)", "(^.^)"],
    };

    const drawRabbit = (cells: Cells, rb: Rabbit) => {
      if (rb.state === "hidden") return;
      const col = Math.floor(rb.x / cw) - 2, row = Math.floor(rb.y / ch) - 1;
      /* Mid-hop, the rabbit lifts a row and leaves a shadow on the grass. */
      const t = rb.air > 0 ? 1 - rb.air / rb.hop : 0;
      const lift = rb.air > 0 && t > 0.2 && t < 0.8 ? 1 : 0;
      if (lift) for (let k = 1; k < 4; k++) put(cells, col + k, row + 2, code("_"), 0.4, SHADOW);
      const face = rb.binky && lift ? FACES.binky : FACES[rb.state] ?? FACES.graze;
      face.forEach((line, dr) => {
        for (let dc = 0; dc < line.length; dc++) {
          const glyph = line[dc];
          const tail = rb.state === "flee" && dr === 1 && dc === 2;
          const eye = dr === 1 && (glyph === "o" || glyph === "-" || glyph === "^") && !tail;
          const r = row + dr - lift;
          if (glyph !== " ") stamp(cells, col + dc, r, glyph, 1, tail ? TAIL : eye ? HAWK_DARK : RABBIT_DARK);
          /* Solid fur behind the glyphs; the tail is a bright patch. */
          block(cells, col + dc, r, tail ? TAIL : RABBIT, tail ? 0.85 : dr === 0 && (dc === 0 || dc === 4) ? 0.2 : 0.42);
        }
      });
    };

    /* -------------------------------------------------------------- loop */

    return {
      step(dt: number, pointer: Pointer) {
        clock += dt;
        for (const tap of pointer.taps) {
          clover.push({ x: tap.x, y: tap.y, left: 1 });
          if (clover.length > 4) clover.shift();
        }
        for (let i = clover.length - 1; i >= 0; i--) if ((clover[i].left -= dt * 0.01) <= 0) clover.splice(i, 1);
        stepHawk(dt);
        stepRabbits(dt, pointer);
        if (pointer.inside && Math.hypot(pointer.vx, pointer.vy) > 120) deposit(trample, pointer.x, pointer.y, 0.15, 0);
        settle(dt);
      },

      draw(cells: Cells) {
        /* Grass: sparse blades, brightened where a gust rolls across. */
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            const n = hash3(c, r, 1);
            const x = c * cw, y = r * ch;
            const gust = Math.sin(x * 0.006 + y * 0.004 - clock * 0.9) * Math.sin(x * 0.0021 - y * 0.003 + clock * 0.23);
            const tr = trample[i];
            if (tr > 0.12) {
              put(cells, c, r, code(tr > 0.5 ? "_" : "-"), 0.3 + tr * 0.3, TRAMPLE);
              continue;
            }
            if (n > 0.58 + gust * 0.12) continue;
            const lit = gust > 0.62 && n < 0.3;
            const glyph = lit ? stroke(-Math.PI / 2 + 0.6) : code(BLADES[Math.floor(hash3(c, r, 2) * BLADES.length)]);
            put(cells, c, r, glyph, lit ? 0.34 : 0.18 + n * 0.25, lit ? GRASS_LIT : n > 0.3 ? GRASS : GRASS_DARK);
          }
        }

        /* Wildflowers, fixed in place. */
        for (let k = 0; k < cols * rows * 0.004; k++) {
          const c = Math.floor(hash3(k, 3, 9) * cols), r = Math.floor(hash3(k, 4, 9) * rows);
          const pick = hash3(k, 5, 9);
          put(cells, c, r, code(pick < 0.5 ? "*" : "o"), 0.75, pick < 0.45 ? BLOOM_Y : pick < 0.8 ? BLOOM_W : BLOOM_P);
        }

        for (const cl of clover) {
          const c0 = Math.floor(cl.x / cw), r0 = Math.floor(cl.y / ch);
          for (let dr = -2; dr <= 2; dr++)
            for (let dc = -5; dc <= 5; dc++) {
              const d = Math.hypot(dc * (cw / ch), dr) / 2.4;
              if (d > cl.left || hash3(c0 + dc, r0 + dr, 11) > 0.75) continue;
              const bloom = hash3(c0 + dc, r0 + dr, 12) > 0.85;
              put(cells, c0 + dc, r0 + dr, code(bloom ? "*" : "&"), 0.85, bloom ? BLOOM_P : CLOVER);
            }
        }

        /* Dust. */
        for (let i = 0; i < dust.length; i++) {
          const e = dust[i];
          if (e < 0.08) continue;
          put(cells, i % cols, (i / cols) | 0, code(e > 0.6 ? "%" : e > 0.3 ? ":" : "."), clamp(0.25 + e * 0.6), DUST);
        }

        /* Burrows: a mound of earth around a dark mouth. */
        for (const b of burrows) {
          const c0 = Math.floor(b.x / cw), r0 = Math.floor(b.y / ch);
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -3; dc <= 3; dc++) {
              const mouth = dr === 0 && Math.abs(dc) <= 1;
              const d = Math.hypot(dc / 3.5, dr / 1.5);
              if (d > 1) continue;
              if (mouth) {
                stamp(cells, c0 + dc, r0 + dr, "@", 0.9, HOLE);
                block(cells, c0 + dc, r0 + dr, HOLE, 0.6);
              } else {
                stamp(cells, c0 + dc, r0 + dr, hash3(dc, dr, 13) > 0.5 ? ":" : ".", 0.8, DIRT);
                block(cells, c0 + dc, r0 + dr, DIRT, 0.18);
              }
            }
        }

        drawHawkShape(cells, true);
        for (const rb of rabbits) drawRabbit(cells, rb);
        drawHawkShape(cells, false);
      },
    };
  },
};
