/**
 * Koi pond, in colour. A few koi wander a still pond over a floor of moving
 * caustics; the water is a wave field at cell resolution, so their wakes, the
 * odd falling leaf and your cursor all leave ripples that cross and fade. Tap
 * the water to drop food and the nearest koi come for it.
 *
 * After the ascii-sharks ocean (@stackedlol) and the koi ponds that answered
 * it: a follow-the-leader spine with its bend clamped, so a body curls into a
 * C and never a knot; skin glyphs that run sparse where light catches and
 * dense in shadow; and strokes (- / | \) only where something has a direction,
 * here the fins and the ripple fronts.
 *
 * Each koi is lit as a rounded body (a fake normal from how far across the
 * body a cell sits), so the 70-step ramp carries a real gradient, and it is
 * patterned after a named variety.
 */
import { put, stamp, stroke, rng, code, FINE, type Cells, type Pointer, type Scene } from "./engine";

/* Palette indices. Keep in step with `palette` below. */
const WATER = 1, CAUSTIC = 2, SHADOW = 3;
const ORANGE = 4, RED = 5, SUMI = 6, WHITE = 7, GOLD = 8;
const FIN_WARM = 9, FIN_PALE = 10;
const PAD = 11, PAD_DARK = 12, LOTUS = 13, FOOD = 14, EYE = 15;

const SEGMENTS = 18;
/** Most a body may bend between two segments, radians. */
const MAX_BEND = 0.16;

/** Base colour, patch colour, spot colour, fin colour, per variety. */
const VARIETIES: [number, number, number, number][] = [
  [WHITE, RED, RED, FIN_PALE], //       kohaku: white with red
  [WHITE, RED, SUMI, FIN_PALE], //      sanke: white, red, black spots
  [SUMI, RED, WHITE, FIN_PALE], //      showa: black with red and white
  [GOLD, GOLD, ORANGE, FIN_WARM], //    ogon: plain gold
  [ORANGE, ORANGE, SUMI, FIN_WARM], //  orange with a few black spots
];

type Point = { x: number; y: number };

type Koi = {
  spine: Point[];
  heading: number;
  turn: number;
  speed: number;
  cruise: number;
  /** Body length and half-width, CSS px. */
  length: number;
  girth: number;
  /** Swim cycle, radians. */
  phase: number;
  seed: number;
  colors: [number, number, number, number];
  /** Patch pattern: per-fish frequencies and offsets. */
  pattern: number[];
};

type Pad = { x: number; y: number; rx: number; ry: number; notch: number; flower: boolean };
type Food = { x: number; y: number; age: number };

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Half-width along the body, head (0) to tail (1). */
function profile(t: number) {
  if (t < 0.22) return 0.5 + 0.5 * Math.sin((t / 0.22) * Math.PI * 0.5);
  return 1 - 0.9 * Math.pow((t - 0.22) / 0.78, 1.25);
}

const fine = (v: number) => code(FINE[Math.round(clamp(v) * (FINE.length - 1))] ?? " ");

export const koi: Scene = {
  font: 9,
  leading: 1.25,
  fps: 30,
  peak: [0.62, 0.55],
  underText: 0.32,
  palette: {
    light: [
      "#3b7f99", // water
      "#79b4c2", // caustic
      "#6d7f86", // shadow
      "#e2601f", // orange
      "#c8322a", // red
      "#22262a", // sumi
      "#98a4ab", // white skin, cooled so it shows on paper
      "#cf9a12", // gold
      "#ec9a66", // warm fin
      "#a9b6bb", // pale fin
      "#4f8a3a", // pad
      "#2d6630", // pad, dark
      "#de6f94", // lotus
      "#8a5a2b", // food
      "#15181a", // eye
    ],
    dark: [
      "#5fb4cf",
      "#2f6f80",
      "#06090a",
      "#ff7c37",
      "#ff4d3f",
      "#59636b",
      "#e8ece9",
      "#ffcb45",
      "#ffae80",
      "#c9d4d7",
      "#6fb14f",
      "#3f8a3c",
      "#ff92b8",
      "#c79157",
      "#0b0d0c",
    ],
  },

  create(cells: Cells, width: number, height: number) {
    const { cols, rows, cw, ch } = cells;
    const random = rng(7);

    /* ------------------------------------------------------------- water */

    /* Two height fields, leapfrogged. Coefficients differ by axis because a
       cell is taller than it is wide; this keeps ripples round on screen. */
    let h = new Float32Array(cols * rows);
    let prev = new Float32Array(cols * rows);
    const kx = 0.24;
    const ky = kx * (cw / ch) * (cw / ch);
    const damping = 0.972;

    const disturb = (x: number, y: number, amount: number, radius = 1) => {
      const c0 = Math.floor(x / cw), r0 = Math.floor(y / ch);
      const rc = Math.ceil((radius * ch) / cw);
      for (let dr = -radius; dr <= radius; dr++)
        for (let dc = -rc; dc <= rc; dc++) {
          const c = c0 + dc, r = r0 + dr;
          if (c < 1 || r < 1 || c >= cols - 1 || r >= rows - 1) continue;
          const d = Math.hypot((dc * cw) / ch, dr) / (radius + 0.5);
          if (d < 1) h[r * cols + c] += amount * (1 - d * d);
        }
    };

    const waves = () => {
      const next = prev;
      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          const i = r * cols + c;
          const lap = kx * (h[i - 1] + h[i + 1] - 2 * h[i]) + ky * (h[i - cols] + h[i + cols] - 2 * h[i]);
          next[i] = (2 * h[i] - prev[i] + lap) * damping;
        }
      }
      prev = h;
      h = next;
    };

    /* --------------------------------------------------------------- koi */

    const count = Math.max(2, Math.min(5, Math.round((width * height) / 280000)));
    const fish: Koi[] = Array.from({ length: count }, (_, n) => {
      const length = Math.min(320, Math.max(160, width * 0.18)) * (0.78 + random() * 0.32);
      const heading = random() * Math.PI * 2;
      const x = width * (0.15 + random() * 0.7), y = height * (0.15 + random() * 0.7);
      const seg = length / (SEGMENTS - 1);
      return {
        spine: Array.from({ length: SEGMENTS }, (_, i) => ({
          x: x - Math.cos(heading) * seg * i,
          y: y - Math.sin(heading) * seg * i,
        })),
        heading,
        turn: 0,
        speed: 30,
        cruise: 22 + random() * 14,
        length,
        girth: length * (0.16 + random() * 0.02),
        phase: random() * 10,
        seed: n * 17.3 + random() * 100,
        colors: VARIETIES[n % VARIETIES.length],
        pattern: Array.from({ length: 6 }, () => random() * 6),
      };
    });

    /* Lily pads keep to the margins, where nothing is written over them. */
    const pads: Pad[] = [];
    if (width > 760) {
      const spots: Point[] = [
        { x: width * 0.07, y: height * 0.24 },
        { x: width * 0.93, y: height * 0.6 },
        { x: width * 0.9, y: height * 0.13 },
        { x: width * 0.06, y: height * 0.8 },
        { x: width * 0.12, y: height * 0.52 },
      ];
      spots.forEach((s, i) => {
        const rx = 42 + random() * 30;
        pads.push({ x: s.x, y: s.y, rx, ry: rx * 0.7, notch: random() * Math.PI * 2, flower: i === 0 || i === 2 });
      });
    }

    const food: Food[] = [];
    let clock = 0;
    let nextDrop = 2;
    let trail = 0;

    const steer = (k: Koi, dt: number, pointer: Pointer) => {
      const head = k.spine[0];
      /* Wander: slow, smooth noise from a few sines at fish-specific rates. */
      const t = clock * 0.33 + k.seed;
      let want = 0.55 * Math.sin(t * 0.9) + 0.35 * Math.sin(t * 2.3 + 1.7) + 0.2 * Math.sin(t * 5.1);
      let urgency = 1;

      /* Keep inside the pond: turn toward the middle near an edge. */
      const margin = 120;
      const edge = Math.max(
        smooth(margin, 0, head.x),
        smooth(width - margin, width, head.x),
        smooth(margin, 0, head.y),
        smooth(height - margin, height, head.y),
      );
      if (edge > 0) {
        const home = Math.atan2(height / 2 - head.y, width / 2 - head.x);
        want = want * (1 - edge) + wrap(home - k.heading) * 3 * edge;
      }

      /* Food, if any is close enough to notice. */
      let target: Food | null = null;
      let best = 420;
      for (const f of food) {
        const d = Math.hypot(f.x - head.x, f.y - head.y);
        if (d < best) (best = d), (target = f);
      }
      if (target) {
        want = wrap(Math.atan2(target.y - head.y, target.x - head.x) - k.heading) * 2.4;
        urgency = 1.9;
        if (best < 12) {
          food.splice(food.indexOf(target), 1);
          disturb(target.x, target.y, 1.4, 1);
        }
      }

      /* A cursor moving fast nearby startles them; a resting one is ignored. */
      if (pointer.inside) {
        const dx = head.x - pointer.x, dy = head.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && Math.hypot(pointer.vx, pointer.vy) > 260) {
          want = wrap(Math.atan2(dy, dx) - k.heading) * 3;
          urgency = 2.6;
        }
      }

      /* Give each other room. */
      for (const o of fish) {
        if (o === k) continue;
        const dx = head.x - o.spine[3].x, dy = head.y - o.spine[3].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) want += wrap(Math.atan2(dy, dx) - k.heading) * (1 - d / 130) * 1.2;
      }

      /* Turning circle no tighter than about a third of the body, or the
         spine coils into a ball. */
      const tightest = k.speed / (k.length * 0.32);
      k.turn += (clamp(want, -1.5, 1.5) * Math.min(1, tightest) - k.turn) * Math.min(1, dt * 2.2);
      k.heading = wrap(k.heading + k.turn * dt);
      k.speed += (k.cruise * urgency - k.speed) * Math.min(1, dt * 1.5);
    };

    const swim = (k: Koi, dt: number) => {
      const s = k.spine;
      s[0].x += Math.cos(k.heading) * k.speed * dt;
      s[0].y += Math.sin(k.heading) * k.speed * dt;
      const seg = k.length / (SEGMENTS - 1);
      for (let i = 1; i < SEGMENTS; i++) {
        let a = Math.atan2(s[i].y - s[i - 1].y, s[i].x - s[i - 1].x);
        /* Clamp the bend against the segment in front. */
        if (i > 1) {
          const run = Math.atan2(s[i - 1].y - s[i - 2].y, s[i - 1].x - s[i - 2].x);
          a = run + clamp(wrap(a - run), -MAX_BEND, MAX_BEND);
        }
        s[i].x = s[i - 1].x + Math.cos(a) * seg;
        s[i].y = s[i - 1].y + Math.sin(a) * seg;
      }
      k.phase += dt * (2.2 + k.speed * 0.07);
      /* A faint wake from the shoulders, stronger when hurrying. */
      if (random() < 0.3) disturb(s[3].x, s[3].y, 0.04 + k.speed * 0.002, 0);
    };

    /* Body rendered with a swimming wave travelling down it. */
    const body = (k: Koi): Point[] =>
      k.spine.map((p, i) => {
        const t = i / (SEGMENTS - 1);
        const next = k.spine[Math.min(SEGMENTS - 1, i + 1)], back = k.spine[Math.max(0, i - 1)];
        const a = Math.atan2(next.y - back.y, next.x - back.x);
        const sway = Math.sin(k.phase - t * 4.2) * k.girth * 0.4 * t * t;
        return { x: p.x - Math.sin(a) * sway, y: p.y + Math.cos(a) * sway };
      });

    /** A fin ray, drawn in strokes, fading toward its tip. */
    const ray = (cells: Cells, x: number, y: number, angle: number, length: number, ink: number, color: number) => {
      const glyph = stroke(angle);
      for (let d = 0; d <= length; d += Math.min(cw, ch) * 0.5) {
        put(cells, (x + Math.cos(angle) * d) / cw, (y + Math.sin(angle) * d) / ch, glyph, ink * (1 - (d / length) * 0.6), color);
      }
    };

    /** Visit each cell inside a body, with where it sits on that body. */
    const eachCell = (
      pts: Point[],
      R: number,
      dx: number,
      dy: number,
      fn: (c: number, r: number, along: number, across: number) => void,
    ) => {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const p of pts) {
        x0 = Math.min(x0, p.x);
        x1 = Math.max(x1, p.x);
        y0 = Math.min(y0, p.y);
        y1 = Math.max(y1, p.y);
      }
      const c0 = Math.max(0, Math.floor((x0 - R + dx) / cw)), c1 = Math.min(cols - 1, Math.ceil((x1 + R + dx) / cw));
      const r0 = Math.max(0, Math.floor((y0 - R + dy) / ch)), r1 = Math.min(rows - 1, Math.ceil((y1 + R + dy) / ch));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const px = (c + 0.5) * cw - dx, py = (r + 0.5) * ch - dy;
          let best = 1e9, along = 0, side = 0;
          for (let i = 0; i < SEGMENTS - 1; i++) {
            const a = pts[i], b = pts[i + 1];
            const vx = b.x - a.x, vy = b.y - a.y;
            const len2 = vx * vx + vy * vy || 1;
            const t = clamp(((px - a.x) * vx + (py - a.y) * vy) / len2);
            const ex = px - (a.x + vx * t), ey = py - (a.y + vy * t);
            const d = ex * ex + ey * ey;
            if (d < best) {
              best = d;
              along = (i + t) / (SEGMENTS - 1);
              side = vx * ey - vy * ex;
            }
          }
          const w = R * profile(along);
          const d = Math.sqrt(best);
          if (d <= w) fn(c, r, along, (side < 0 ? -1 : 1) * (d / w));
        }
      }
    };

    /* Light from the upper left, in body space: +across is the fish's right. */
    const light = { x: -0.45, z: 0.89 };

    const drawShadow = (cells: Cells, k: Koi) => {
      eachCell(body(k), k.girth * 1.05, 14, 18, (c, r, along, across) => {
        const v = (1 - across * across) * (1 - along * 0.6);
        put(cells, c, r, v > 0.45 ? code(":") : code("."), 0.22 + v * 0.18, SHADOW);
      });
    };

    const drawKoi = (cells: Cells, k: Koi) => {
      const pts = body(k);
      const R = k.girth;
      const [base, patch, spot, fin] = k.colors;
      const p = k.pattern;

      /* Fins first, so the body sits on top of their roots. */
      const shoulder = pts[4], neck = pts[3];
      const a = Math.atan2(shoulder.y - neck.y, shoulder.x - neck.x);
      const paddle = Math.sin(k.phase * 0.6) * 0.22;
      for (const s of [-1, 1]) {
        for (let f = 0; f < 4; f++) {
          const out = a + s * (Math.PI * 0.55 + paddle + f * 0.14);
          ray(cells, shoulder.x + Math.cos(out) * R * 0.6, shoulder.y + Math.sin(out) * R * 0.6, out, R * (1.5 - f * 0.18), 0.62, fin);
        }
      }
      const t1 = pts[SEGMENTS - 1], t0 = pts[SEGMENTS - 3];
      const tail = Math.atan2(t1.y - t0.y, t1.x - t0.x);
      const flick = Math.sin(k.phase - 4.2) * 0.28;
      for (let f = -3; f <= 3; f++) {
        ray(cells, t1.x, t1.y, tail + f * 0.15 + flick, R * (2.1 - Math.abs(f) * 0.12), 0.7, fin);
      }

      eachCell(pts, R, 0, 0, (c, r, along, across) => {
        /* A rounded body: the normal tips toward the edges. */
        const nz = Math.sqrt(Math.max(0, 1 - across * across));
        const lit = clamp(across * light.x + nz * light.z);
        /* On paper, more ink is darker: shade runs dense where unlit. */
        let shade = 0.18 + 0.62 * (1 - lit) + 0.25 * nz;
        /* A darker ridge along the spine, and a paler head. */
        shade += 0.12 * Math.exp(-across * across * 30) - 0.1 * smooth(0.15, 0, along);

        let color = base;
        const blot = Math.sin(along * (5 + p[0]) + p[1]) * Math.cos(across * (2 + p[2]) + p[3] + along * 4);
        if (blot > 0.25) color = patch;
        const dot = Math.sin(along * (13 + p[4] * 2) + p[5]) * Math.sin(across * 7 + along * 9 + p[2]);
        if (dot > 0.72 && along > 0.15) color = spot;
        if (color !== base) shade += 0.12;

        put(cells, c, r, fine(clamp(shade, 0.12, 1)), 0.55 + clamp(shade) * 0.45, color);
      });

      /* Eyes, either side of the head. */
      const head = pts[0], next = pts[1];
      const ha = Math.atan2(head.y - next.y, head.x - next.x);
      for (const s of [-1, 1]) {
        const ex = head.x + Math.cos(ha) * R * 0.15 + Math.cos(ha + (s * Math.PI) / 2) * R * 0.5;
        const ey = head.y + Math.sin(ha) * R * 0.15 + Math.sin(ha + (s * Math.PI) / 2) * R * 0.5;
        stamp(cells, ex / cw, ey / ch, "o", 1, EYE);
      }
    };

    const drawPad = (cells: Cells, pad: Pad) => {
      const lift = h[Math.floor(pad.y / ch) * cols + Math.floor(pad.x / cw)] ?? 0;
      const c0 = Math.floor((pad.x - pad.rx) / cw), c1 = Math.ceil((pad.x + pad.rx) / cw);
      const r0 = Math.floor((pad.y - pad.ry) / ch), r1 = Math.ceil((pad.y + pad.ry) / ch);
      const rim = 1 - Math.max(cw / pad.rx, ch / pad.ry) * 0.9;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const dx = ((c + 0.5) * cw - pad.x) / pad.rx, dy = ((r + 0.5) * ch - pad.y) / pad.ry;
          const d = Math.hypot(dx, dy);
          if (d > 1) continue;
          const angle = wrap(Math.atan2(dy, dx) - pad.notch);
          /* The notch: a wedge cut to the centre. */
          if (Math.abs(angle) < 0.26) continue;
          if (d > rim) {
            stamp(cells, c, r, stroke(Math.atan2(dx * pad.ry, -dy * pad.rx)), clamp(0.75 + lift), PAD_DARK);
            continue;
          }
          const vein = Math.abs(Math.sin(angle * 3.5)) < 0.2 && d > 0.15;
          /* Lit from the upper left, like the koi. */
          const lit = clamp(0.5 - dx * 0.35 - dy * 0.35 + (1 - d) * 0.2);
          const glyph = vein ? stroke(Math.atan2(dy * pad.ry, dx * pad.rx)) : fine(0.25 + (1 - lit) * 0.45);
          stamp(cells, c, r, glyph, vein ? 0.6 : 0.42 + (1 - lit) * 0.3, vein ? PAD_DARK : PAD);
        }
      }
      if (!pad.flower) return;
      /* A lotus: petals around a gold centre, off to one side of the pad. */
      const fc = Math.floor((pad.x - pad.rx * 0.15) / cw), fr = Math.floor((pad.y - pad.ry * 0.2) / ch);
      const petals: [number, number, string][] = [
        [0, -1, "^"], [-1, 0, "("], [1, 0, ")"], [-1, -1, "/"], [1, -1, "\\"], [0, 1, "v"], [-2, 0, "<"], [2, 0, ">"],
      ];
      for (const [dc, dr, g] of petals) stamp(cells, fc + dc, fr + dr, g, 0.95, LOTUS);
      stamp(cells, fc, fr, "@", 1, GOLD);
    };

    return {
      step(dt: number, pointer: Pointer) {
        clock += dt;

        /* A leaf or a midge lands now and then. */
        if (clock > nextDrop) {
          disturb(random() * width, random() * height, 1.6, 1);
          nextDrop = clock + 3 + random() * 5;
        }

        /* The cursor drags a faint line through the water. */
        const fast = Math.hypot(pointer.vx, pointer.vy);
        if (pointer.inside && fast > 40) {
          trail += dt;
          if (trail > 0.05) {
            disturb(pointer.x, pointer.y, Math.min(0.5, fast * 0.0008), 0);
            trail = 0;
          }
        }

        for (const tap of pointer.taps) {
          disturb(tap.x, tap.y, 2.2, 1);
          food.push({ x: tap.x, y: tap.y, age: 0 });
          if (food.length > 6) food.shift();
        }
        for (let i = food.length - 1; i >= 0; i--) if ((food[i].age += dt) > 14) food.splice(i, 1);

        for (const k of fish) {
          steer(k, dt, pointer);
          swim(k, dt);
        }
        waves();
      },

      draw(cells: Cells) {
        /* The pond floor: light focused by the surface into a slow net. */
        const t = clock * 0.35;
        for (let r = 0; r < rows; r++) {
          const y = (r + 0.5) * ch * 0.012;
          for (let c = 0; c < cols; c++) {
            const x = (c + 0.5) * cw * 0.012;
            const i = r * cols + c;
            const wx = x + 0.6 * Math.sin(y * 1.7 + t) + h[i] * 0.4;
            const wy = y + 0.6 * Math.sin(x * 1.3 - t * 0.8);
            const net =
              Math.abs(Math.sin(wx * 2.1 + Math.sin(wy * 1.9 - t))) * Math.abs(Math.sin(wy * 2.4 + Math.sin(wx * 1.6 + t * 0.7)));
            if (net > 0.86) put(cells, c, r, net > 0.94 ? code("~") : code("-"), 0.16 + (net - 0.86) * 1.6, CAUSTIC);
            else if (net > 0.74 && (c + r * 3) % 4 === 0) put(cells, c, r, code("."), 0.14, CAUSTIC);
          }
        }

        for (const k of fish) drawShadow(cells, k);

        /* Ripples: a stroke along each wavefront, a dot where it's faint. */
        for (let r = 1; r < rows - 1; r++) {
          for (let c = 1; c < cols - 1; c++) {
            const i = r * cols + c;
            const v = h[i];
            if (v < 0.05) continue;
            const gx = (h[i + 1] - h[i - 1]) / cw, gy = (h[i + cols] - h[i - cols]) / ch;
            const glyph = v < 0.11 ? code(".") : stroke(Math.atan2(gx, -gy));
            put(cells, c, r, glyph, Math.min(0.85, 0.3 + v * 1.4), WATER);
          }
        }

        for (const f of food) put(cells, f.x / cw, f.y / ch, "o", 0.95 * (1 - f.age / 14), FOOD);
        for (const k of fish) drawKoi(cells, k);
        for (const pad of pads) drawPad(cells, pad);
      },
    };
  },
};
