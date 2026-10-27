/**
 * Jellyfish. A bloom drifting through open water: bells pulse to swim (a
 * sharp contraction, then a long glide and a slow sink), tentacles and oral
 * arms trail behind as rope physics, and the water carries marine snow, light
 * from the surface and plankton that glows where anything stirs it. The
 * cursor stirs it too; a tap sets off a flash.
 *
 * The bloom lives on the page, not the screen: jellies are spread down the
 * whole length of the page and across its full width, thicker the deeper you
 * go, and each keeps to its own stretch of page. Scrolling doesn't touch
 * them; it only brings the next ones into view, like the rest of the page.
 *
 * What's borrowed from ascii-sharks (@stackedlol): bodies are supersampled per
 * cell, so a cell fully inside a bell is solid tissue and a partly covered one
 * becomes a light edge glyph; skin glyphs are picked by hashing the body
 * coordinate rather than the screen cell, so the texture rides with the bell;
 * and a diffusing energy field stands in for disturbed water. What's its own:
 * a pulse-and-glide swimmer instead of a steering one, translucent bells lit
 * by a fresnel term, verlet tentacles, and four species with their own shape.
 */
import { put, block, stroke, rng, code, hash3, type Cells, type Pointer, type Scene, type View } from "./engine";

/* Palette indices. Keep in step with `palette` below. */
const SNOW = 1, RAY = 2, GLOW = 3, GLOW_HOT = 4;
const MOON = 5, MOON_EDGE = 6, MOON_GONAD = 7, MOON_TENTACLE = 8;
const NETTLE = 9, NETTLE_STRIPE = 10, NETTLE_TENTACLE = 11, NETTLE_ARM = 12;
const MANE = 13, MANE_EDGE = 14, MANE_HAIR = 15;
const COMB = 16; // and the next five: the comb rows' rainbow
const RAINBOW = [17, 18, 19, 20, 21, 22];

type Kind = "moon" | "nettle" | "mane" | "comb";

type Species = {
  bell: number;
  edge: number;
  tentacle: number;
  arm: number;
  /** Bell radius as a fraction of the base size. */
  size: number;
  tentacles: number;
  /** Tentacle and oral arm length, in bell radii. */
  reach: number;
  armReach: number;
  /** Seconds per pulse. */
  period: number;
};

const SPECIES: Record<Kind, Species> = {
  moon: { bell: MOON, edge: MOON_EDGE, tentacle: MOON_TENTACLE, arm: MOON_GONAD, size: 1, tentacles: 12, reach: 0.7, armReach: 0.55, period: 2.6 },
  nettle: { bell: NETTLE, edge: NETTLE_STRIPE, tentacle: NETTLE_TENTACLE, arm: NETTLE_ARM, size: 0.85, tentacles: 10, reach: 3.2, armReach: 2.4, period: 2.1 },
  mane: { bell: MANE, edge: MANE_EDGE, tentacle: MANE_HAIR, arm: MANE_EDGE, size: 1.45, tentacles: 16, reach: 3.6, armReach: 1.6, period: 3.4 },
  comb: { bell: COMB, edge: COMB, tentacle: COMB, arm: COMB, size: 0.42, tentacles: 0, reach: 0, armReach: 0, period: 1 },
};

const NODES = 14;
const ARM_NODES = 12;

type Rope = { x: Float32Array; y: Float32Array; px: Float32Array; py: Float32Array; seg: number; root: number };

type Jelly = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Bell axis, radians; -PI/2 is swimming straight up. */
  dir: number;
  /** Where it would like to point. */
  want: number;
  R: number;
  phase: number;
  /** 0 relaxed .. 1 fully contracted. */
  squeeze: number;
  /** 0.55 far .. 1 near. */
  depth: number;
  /** The depth on the page it likes to hang at, so the bloom stays spread out. */
  home: number;
  id: number;
  tentacles: Rope[];
  arms: Rope[];
};

type Mote = { x: number; y: number; z: number; drift: number };

const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Bell tissue, sparse where it's thin and lit, dense along the rim. */
const TISSUE = " .:-=+*%#@";
const EDGE_LIGHT = ".'`,";
const EDGE_HEAVY = ":;";
const FRILL = "{}()";

/* Sub-cell sample offsets, centre first, for anti-aliased silhouettes. */
const SAMPLES = [0.5, 0.5, 0.25, 0.3, 0.75, 0.3, 0.25, 0.72, 0.75, 0.72];

export const jellyfish: Scene = {
  font: 9,
  leading: 1.3,
  weight: 600,
  fps: 30,
  peak: [0.62, 0.75],
  underText: 0.3,
  palette: {
    light: [
      "#9ab1bf", // snow
      "#8fb8cc", // ray
      "#3fa8b8", // glow
      "#1f8f9f", // glow, hot
      "#7aa6c2", // moon
      "#4f7f9e", // moon edge
      "#a46cc0", // moon gonads
      "#8aa8bb", // moon tentacles
      "#df8a3a", // nettle
      "#b4502a", // nettle stripes
      "#8a2f2b", // nettle tentacles
      "#e2a46e", // nettle oral arms
      "#cf5a33", // lion's mane
      "#a33a24", // lion's mane edge
      "#d9952e", // lion's mane hair
      "#8db7c9", // comb jelly
      "#e2554a", "#e8a33a", "#c9c13a", "#4fb36a", "#3f8fd6", "#8a5fd0",
    ],
    dark: [
      "#5d7484",
      "#2b4f63",
      "#4fe3d0",
      "#a6fff2",
      "#a9d8f5",
      "#e3f4ff",
      "#d79cff",
      "#9cc8e0",
      "#ffa04d",
      "#ffcf8a",
      "#ff6a5a",
      "#ffd3a8",
      "#ff7a4d",
      "#ffb27a",
      "#ffcf5a",
      "#bfe9ff",
      "#ff6b6b", "#ffb347", "#f5f06a", "#6dff9a", "#5ab8ff", "#c08bff",
    ],
  },

  create(cells: Cells, width: number, height: number, view: View) {
    const { cols, rows, cw, ch } = cells;
    const random = rng(41);

    /* --------------------------------------------------------- the water */

    /* Disturbed water: anything moving deposits energy, which spreads and
       fades. Plankton glows where it's high. */
    let energy = new Float32Array(cols * rows);
    let spare = new Float32Array(cols * rows);

    const deposit = (x: number, y: number, amount: number, radius = 0) => {
      const c0 = Math.floor(x / cw), r0 = Math.floor(y / ch);
      for (let r = r0 - radius; r <= r0 + radius; r++) {
        for (let c = c0 - radius * 2; c <= c0 + radius * 2; c++) {
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const d = Math.hypot((c - c0) * (cw / ch), r - r0) / (radius + 0.6);
          if (d > 1) continue;
          const i = r * cols + c;
          energy[i] = Math.min(1.6, energy[i] + amount * (1 - d));
        }
      }
    };

    const diffuse = (dt: number) => {
      const decay = Math.exp(-dt * 1.1);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const l = c > 0 ? energy[i - 1] : energy[i];
          const rt = c < cols - 1 ? energy[i + 1] : energy[i];
          const u = r > 0 ? energy[i - cols] : energy[i];
          const d = r < rows - 1 ? energy[i + cols] : energy[i];
          spare[i] = (energy[i] * 4 + l + rt + u + d) * 0.125 * decay;
        }
      }
      [energy, spare] = [spare, energy];
    };

    /** A slow, divergence-free current (the curl of a drifting stream function). */
    const current = (x: number, y: number, t: number) => {
      const a = x / 300 + t * 0.05, b = y / 340 - t * 0.04, c = (x + y) / 220 + t * 0.08;
      return {
        x: (-Math.sin(a) * Math.sin(b) / 340 + (0.5 * Math.cos(c)) / 220) * 2600,
        y: (-Math.cos(a) * Math.cos(b) / 300 - (0.5 * Math.cos(c)) / 220) * 2600,
      };
    };

    const snow: Mote[] = Array.from({ length: Math.round((cols * rows) / 140) }, () => ({
      x: random() * width,
      y: random() * height,
      z: random() < 0.6 ? 0.5 : 1,
      drift: random() * 10,
    }));

    /* ----------------------------------------------------------- jellies */

    const base = clamp(Math.min(width, height) * 0.075, 34, 70);
    const rope = (count: number, seg: number, x: number, y: number, root: number): Rope => {
      const r: Rope = {
        x: new Float32Array(count), y: new Float32Array(count),
        px: new Float32Array(count), py: new Float32Array(count),
        seg, root,
      };
      for (let k = 0; k < count; k++) {
        r.x[k] = r.px[k] = x;
        r.y[k] = r.py[k] = y + k * seg;
      }
      return r;
    };

    /* Jellies are placed in page coordinates; the page can grow as it loads. */
    let page = Math.max(view.height, height);

    /* One jelly per ~170k px² of page, so a long page gets a big bloom, with
       more of them deeper down. Moon jellies and comb jellies keep near the
       surface; nettles and lion's manes are mostly deeper. */
    const count = clamp(Math.round((width * page) / 170000), 5, 48);
    const jellies: Jelly[] = Array.from({ length: count }, (_, id) => {
      const fall = Math.pow(random(), 0.65); // 0 top .. 1 bottom, weighted deep
      const pick = random();
      const kind: Kind =
        fall < 0.25 ? (pick < 0.65 ? "moon" : pick < 0.9 ? "comb" : "nettle")
        : fall < 0.6 ? (pick < 0.4 ? "moon" : pick < 0.75 ? "nettle" : pick < 0.9 ? "comb" : "mane")
        : pick < 0.25 ? "moon" : pick < 0.6 ? "nettle" : pick < 0.75 ? "comb" : "mane";
      const sp = SPECIES[kind];
      const depth = 0.55 + random() * 0.45;
      const R = base * sp.size * (0.7 + depth * 0.4);
      const x = width * (0.03 + random() * 0.94);
      const y = height * 0.25 + fall * (page - height * 0.35);
      const tentacles = Array.from({ length: sp.tentacles }, (_, k) =>
        rope(NODES, (R * sp.reach) / NODES, x, y, (k / Math.max(1, sp.tentacles - 1)) * 2 - 1),
      );
      const arms = kind === "comb" ? [] : [-0.3, -0.1, 0.1, 0.3].map((root) => rope(ARM_NODES, (R * sp.armReach) / ARM_NODES, x, y, root));
      return {
        kind, x, y, vx: 0, vy: 0,
        dir: -Math.PI / 2 + (random() - 0.5) * 0.8,
        want: -Math.PI / 2,
        R, phase: random(), squeeze: 0, depth, home: y, id, tentacles, arms,
      };
    });
    /* Far ones first, so the near ones swim over them. */
    jellies.sort((a, b) => a.depth - b.depth);

    let clock = 0;

    /** Bell size this instant: narrower and taller when contracted. */
    const bellOf = (j: Jelly) => {
      if (j.kind === "comb") return { w: j.R * 0.62, h: j.R * 1.05 };
      return { w: j.R * (1 - 0.2 * j.squeeze), h: j.R * 0.78 * (1 + 0.14 * j.squeeze) };
    };

    /** Where a rope is tied on, in world space: along the rim, or under the bell. */
    const anchor = (j: Jelly, root: number, arm: boolean) => {
      const { w, h } = bellOf(j);
      const dx = Math.cos(j.dir), dy = Math.sin(j.dir);
      const nx = -dy, ny = dx;
      const v = root * w * (arm ? 1 : 0.94);
      const u = arm ? h * 0.12 : 0;
      return { x: j.x + dx * u + nx * v, y: j.y + dy * u + ny * v };
    };

    const stepRope = (r: Rope, j: Jelly, dt: number, arm: boolean) => {
      const a = anchor(j, r.root, arm);
      const n = r.x.length;
      const back = j.dir + Math.PI;
      for (let k = 1; k < n; k++) {
        const vx = (r.x[k] - r.px[k]) * 0.94, vy = (r.y[k] - r.py[k]) * 0.94;
        r.px[k] = r.x[k];
        r.py[k] = r.y[k];
        const cur = current(r.x[k], r.y[k], clock);
        /* A gentle pull to hang behind the bell, weakest at the tips. */
        const hang = 18 * (1 - k / n);
        /* A wave runs down each strand, out of step with its neighbours, and
           grows toward the tip, so the hair drifts rather than hangs. */
        const sway =
          Math.sin(clock * 1.1 - k * 0.55 + r.root * 5.3 + j.id) * (10 + k * 3) +
          Math.sin(clock * 0.37 + r.root * 11 + j.id * 2) * 14;
        r.x[k] += vx + (cur.x * 0.35 + Math.cos(back) * hang + Math.cos(back + Math.PI / 2) * sway) * dt * dt * 30;
        r.y[k] += vy + (cur.y * 0.35 + Math.sin(back) * hang + 14 + Math.sin(back + Math.PI / 2) * sway) * dt * dt * 30;
      }
      r.x[0] = r.px[0] = a.x;
      r.y[0] = r.py[0] = a.y;
      for (let iter = 0; iter < 2; iter++) {
        for (let k = 1; k < n; k++) {
          const dx = r.x[k] - r.x[k - 1], dy = r.y[k] - r.y[k - 1];
          const d = Math.hypot(dx, dy) || 1e-3;
          const fix = (d - r.seg) / d;
          if (k === 1) {
            r.x[k] -= dx * fix;
            r.y[k] -= dy * fix;
          } else {
            r.x[k] -= dx * fix * 0.5;
            r.y[k] -= dy * fix * 0.5;
            r.x[k - 1] += dx * fix * 0.5;
            r.y[k - 1] += dy * fix * 0.5;
          }
        }
      }
    };

    const swim = (j: Jelly, dt: number, pointer: Pointer, view: View) => {
      const sp = SPECIES[j.kind];
      const before = j.squeeze;
      j.phase = (j.phase + dt / sp.period) % 1;
      /* Fast contraction over the first 28% of the cycle, slow refill after. */
      j.squeeze = j.phase < 0.28 ? Math.sin((j.phase / 0.28) * Math.PI * 0.5) : 1 - smooth(0.28, 1, j.phase);
      const thrust = Math.max(0, j.squeeze - before) / dt;

      /* Wander upward; once well above its home depth, turn over and come
         back down. Keep off the sides and the ends of the page. */
      const t = clock * 0.2 + j.id * 3.1;
      const bottom = page - height * 0.1;
      let want = -Math.PI / 2 + 0.6 * Math.sin(t) + 0.3 * Math.sin(t * 2.3);
      const sinking = j.y < j.home - height * 0.35 || j.y < height * 0.18;
      if (sinking) want = Math.PI / 2 + 0.5 * Math.sin(t);
      if (j.x < width * 0.04) want = wrap(want + 0.6 * (sinking ? -1 : 1));
      if (j.x > width * 0.96) want = wrap(want - 0.6 * (sinking ? -1 : 1));
      if (j.y > bottom) want = -Math.PI / 2;
      j.want = want;

      /* They steer with lopsided pulses, so the bell only turns while squeezing. */
      const turn = clamp(wrap(j.want - j.dir), -1, 1) * (j.kind === "comb" ? 0.8 : thrust * 0.5 + 0.08);
      j.dir = wrap(j.dir + turn * dt);

      const push = j.kind === "comb" ? 18 : thrust * j.R * 0.55;
      j.vx += Math.cos(j.dir) * push * dt;
      j.vy += Math.sin(j.dir) * push * dt;
      const cur = current(j.x, j.y, clock);
      j.vx += cur.x * 0.12 * dt;
      j.vy += (cur.y * 0.12 + 5) * dt; // a slow sink between pulses

      /* Drift away from a cursor that comes close. */
      if (pointer.inside) {
        const dx = j.x - pointer.x, dy = j.y - (pointer.y + view.y);
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 1) {
          const k = (1 - d / 160) * 60;
          j.vx += (dx / d) * k * dt;
          j.vy += (dy / d) * k * dt;
        }
      }

      const drag = Math.exp(-dt * 0.9);
      j.vx *= drag;
      j.vy *= drag;
      j.x = clamp(j.x + j.vx * dt, -j.R * 2, width + j.R * 2);
      j.y = clamp(j.y + j.vy * dt, -j.R * 2, page + j.R * 3);

      /* Off screen by more than a screen or so: let the body drift but skip
         the tentacles. They settle again well before coming into view. */
      const oy = view.y;
      const sy = j.y - oy;
      if (sy < -height * 1.2 || sy > height * 2.2) return;

      /* Each pulse pushes a ring of water out from the rim. */
      if (thrust > 1.2 && j.kind !== "comb") {
        const l = anchor(j, -1, false), r = anchor(j, 1, false);
        deposit(l.x, l.y - oy, 0.08 * j.depth, 1);
        deposit(r.x, r.y - oy, 0.08 * j.depth, 1);
      }

      for (const rope of j.tentacles) stepRope(rope, j, dt, false);
      for (const rope of j.arms) stepRope(rope, j, dt, true);
      /* Tentacle tips brush the plankton. */
      for (const rope of j.tentacles) if (random() < 0.06) deposit(rope.x[NODES - 1], rope.y[NODES - 1] - oy, 0.05, 0);
    };

    /* -------------------------------------------------------- rendering */

    /** Classify a point against a bell. Returns -1 off the body, else a shade 0..1 (and sets `hit`). */
    const hit = { kind: 0, u: 0, v: 0 }; // kind: 1 tissue, 2 rim, 3 cavity, 4 gonad, 5 comb row
    const sample = (j: Jelly, px: number, py: number) => {
      const { w, h } = bellOf(j);
      const dx = Math.cos(j.dir), dy = Math.sin(j.dir);
      const rx = px - j.x, ry = py - j.y;
      const u = rx * dx + ry * dy, v = rx * -dy + ry * dx;
      hit.u = u / h;
      hit.v = v / w;

      if (j.kind === "comb") {
        const e = Math.hypot(v / w, (u - h * 0.1) / h);
        if (e > 1) return -1;
        /* Eight comb rows run pole to pole; they catch the light in a travelling rainbow. */
        const uu = (u - h * 0.1) / h;
        const lon = Math.asin(clamp(v / (w * Math.sqrt(Math.max(0.04, 1 - uu * uu))), -1, 1));
        hit.kind = Math.abs(Math.sin(lon * 4)) < 0.24 && e < 0.96 ? 5 : e > 0.84 ? 2 : 1;
        return e > 0.84 ? 0.8 : 0.15 + 0.3 * e;
      }

      if (u < -h * 0.08) return -1;
      const e = Math.hypot(v / w, Math.max(0, u) / h);
      if (e > 1) return -1;
      /* Scalloped margin: small lappets around the rim. */
      if (u < h * 0.06 && Math.sin((v / w) * 14 + j.id) < -0.55) return -1;
      const inner = Math.hypot(v / (w * 0.8), Math.max(0, u) / (h * 0.55));
      if (inner < 1 && u < h * 0.55) {
        /* The hollow under the bell: almost clear. */
        hit.kind = 3;
        if (j.kind === "moon") {
          /* Gonads: horseshoes either side of the axis. */
          const gx = Math.abs(v / w) - 0.32, gy = u / h - 0.34;
          const g = Math.hypot(gx, gy * 1.3);
          if (g < 0.16 && g > 0.07) {
            hit.kind = 4;
            return 0.75;
          }
        }
        return 0.08;
      }
      hit.kind = e > 0.86 || u < h * 0.08 ? 2 : 1;
      /* Fresnel: the thin top lets light through, the rim seen edge-on doesn't. */
      const fresnel = smooth(0.45, 1, e);
      const lit = clamp(0.5 - (v / w) * 0.35 + (u / h) * 0.3);
      return clamp(0.18 + fresnel * 0.65 + (1 - lit) * 0.15);
    };

    const drawRope = (cells: Cells, r: Rope, color: number, ink: number, frilly: boolean, key: number, oy: number) => {
      const n = r.x.length;
      const step = Math.min(cw, ch) * 0.5;
      for (let k = 0; k < n - 1; k++) {
        const ax = r.x[k], ay = r.y[k] - oy, bx = r.x[k + 1], by = r.y[k + 1] - oy;
        const len = Math.hypot(bx - ax, by - ay);
        const angle = Math.atan2(by - ay, bx - ax);
        const fade = 1 - (k / n) * 0.75;
        for (let d = 0; d <= len; d += step) {
          const x = ax + ((bx - ax) * d) / len, y = ay + ((by - ay) * d) / len;
          /* Stinging cells bead the strands: a dot every few steps. */
          const bead = !frilly && hash3(k, Math.floor(d / step), key) > 0.7;
          const glyph = frilly
            ? code(FRILL[Math.floor(hash3(k, Math.floor(d / step), key) * FRILL.length)])
            : bead ? code(":") : stroke(angle);
          put(cells, x / cw, y / ch, glyph, ink * fade, color);
          if (frilly && k < n - 3) put(cells, x / cw + (hash3(k, 7, key) > 0.5 ? 1 : -1), y / ch, code(","), ink * fade * 0.6, color);
        }
      }
    };

    const drawJelly = (cells: Cells, j: Jelly, view: View) => {
      const sp = SPECIES[j.kind];
      const dim = 0.55 + 0.45 * j.depth;
      const oy = view.y;
      const sy = j.y - oy;
      /* Skip anything whose bell and trailing tentacles are all off screen. */
      if (sy < -j.R * (sp.reach + 2) || sy > height + j.R * (sp.reach + 2)) return;

      for (const [k, rope] of j.tentacles.entries()) drawRope(cells, rope, sp.tentacle, 0.5 * dim, false, j.id * 100 + k, oy);
      for (const [k, rope] of j.arms.entries()) drawRope(cells, rope, sp.arm, 0.78 * dim, j.kind !== "moon", j.id * 10 + k, oy);

      const { w, h } = bellOf(j);
      const reach = Math.max(w, h) * 1.15;
      const c0 = Math.max(0, Math.floor((j.x - reach) / cw)), c1 = Math.min(cols - 1, Math.ceil((j.x + reach) / cw));
      const r0 = Math.max(0, Math.floor((sy - reach) / ch)), r1 = Math.min(rows - 1, Math.ceil((sy + reach) / ch));

      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          let hits = 0, shade = 0, kind = 0, u = 0, v = 0;
          for (let s = 0; s < SAMPLES.length; s += 2) {
            const value = sample(j, (c + SAMPLES[s]) * cw, (r + SAMPLES[s + 1]) * ch + oy);
            if (value < 0) continue;
            if (hits === 0 || s === 0) {
              shade = value;
              kind = hit.kind;
              u = hit.u;
              v = hit.v;
            }
            hits++;
          }
          if (!hits) continue;
          const coverage = hits / 5;
          /* Glyphs keyed to the body, so the texture swims with the bell. */
          const key = hash3(Math.round(u * 9), Math.round(v * 7), j.id);

          if (coverage < 0.6) {
            const set = coverage >= 0.4 ? EDGE_HEAVY : EDGE_LIGHT;
            put(cells, c, r, code(set[Math.floor(key * set.length)]), (0.4 + coverage * 0.5) * dim, sp.edge);
            continue;
          }
          if (kind === 5) {
            const hue = RAINBOW[Math.floor(clock * 6 + u * 4 + j.id) % RAINBOW.length];
            put(cells, c, r, code(key > 0.5 ? "*" : "+"), 0.95 * dim, hue);
            block(cells, c, r, hue, 0.12 * dim);
            continue;
          }
          let color = kind === 2 ? sp.edge : kind === 4 ? MOON_GONAD : sp.bell;
          /* Sea nettles: dark stripes radiating from the crown. */
          if (j.kind === "nettle" && kind === 1 && Math.sin(Math.atan2(v, Math.max(0.05, u)) * 16) > 0.45) color = NETTLE_STRIPE;
          const jitter = (key - 0.5) * 0.12;
          const glyph = code(TISSUE[Math.round(clamp(shade + jitter) * (TISSUE.length - 1))]);
          put(cells, c, r, glyph, (0.35 + shade * 0.65) * dim, color);
          /* Translucent tissue: a faint block, deeper at the rim. */
          if (kind !== 3) block(cells, c, r, sp.bell, (0.08 + shade * 0.14) * dim);
        }
      }
    };

    /* The glow field is in screen space; when the page scrolls, it scrolls too. */
    let shiftedTo = Math.floor(view.y / ch);
    const follow = (y: number) => {
      const target = Math.floor(y / ch);
      const by = target - shiftedTo;
      if (!by) return;
      shiftedTo = target;
      if (Math.abs(by) >= rows) return energy.fill(0);
      const n = Math.abs(by) * cols;
      if (by > 0) {
        energy.copyWithin(0, n);
        energy.fill(0, energy.length - n);
      } else {
        energy.copyWithin(n, 0, energy.length - n);
        energy.fill(0, 0, n);
      }
    };
    let snowAt = view.y;

    return {
      step(dt: number, pointer: Pointer, view: View) {
        clock += dt;
        page = Math.max(view.height, height);

        for (const m of snow) {
          const cur = current(m.x, m.y, clock);
          m.x += (cur.x * 0.15 * m.z + Math.sin(clock * 0.4 + m.drift) * 2) * dt;
          m.y += (6 + 8 * m.z + cur.y * 0.1) * dt;
          if (m.y > height + 4) (m.y = -4), (m.x = random() * width);
          if (m.x < -4) m.x = width + 4;
          if (m.x > width + 4) m.x = -4;
        }

        if (pointer.inside && Math.hypot(pointer.vx, pointer.vy) > 30) deposit(pointer.x, pointer.y, 0.12, 0);
        for (const tap of pointer.taps) {
          deposit(tap.x, tap.y, 1.4, 4);
          for (const j of jellies) {
            const dx = j.x - tap.x, dy = j.y - view.y - tap.y;
            const d = Math.hypot(dx, dy);
            if (d < 220 && d > 1) {
              j.vx += (dx / d) * (1 - d / 220) * 50;
              j.vy += (dy / d) * (1 - d / 220) * 50;
            }
          }
        }

        for (const j of jellies) swim(j, dt, pointer, view);
        diffuse(dt);
      },

      draw(cells: Cells, view: View) {
        follow(view.y);

        /* Marine snow scrolls with the page, and wraps top to bottom. */
        const moved = view.y - snowAt;
        snowAt = view.y;
        for (const m of snow) {
          m.y -= moved;
          if (m.y < -4) m.y += height + 8;
          if (m.y > height + 4) m.y -= height + 8;
        }

        /* Light from the surface: soft slanted shafts that sway, reaching
           down about the first screen of the page and fading with depth. */
        for (let r = 0; r < rows; r++) {
          const fall = 1 - (view.y + r * ch) / (height * 0.75);
          if (fall <= 0) break;
          for (let c = 0; c < cols; c++) {
            const x = c * cw + r * ch * 0.35;
            const shaft = Math.sin(x * 0.011 + Math.sin(clock * 0.21) * 1.5) * Math.sin(x * 0.0047 - clock * 0.08);
            if (shaft < 0.7 || (c + r) % 3) continue;
            put(cells, c, r, code("'"), (shaft - 0.7) * 1.4 * fall, RAY);
          }
        }

        for (const m of snow) put(cells, m.x / cw, m.y / ch, code(m.z > 0.7 ? "," : "."), 0.2 + m.z * 0.3, SNOW);

        /* Plankton, lit by whatever stirred it. */
        for (let i = 0; i < energy.length; i++) {
          const e = energy[i];
          if (e < 0.06) continue;
          const c = i % cols, r = (i / cols) | 0;
          const hot = e > 0.45;
          const glyph = e > 0.7 ? "*" : e > 0.3 ? "+" : hash3(c, r, 3) > 0.5 ? "." : "`";
          put(cells, c, r, code(glyph), clamp(0.2 + e), hot ? GLOW_HOT : GLOW);
        }

        for (const j of jellies) drawJelly(cells, j, view);
      },
    };
  },
};
