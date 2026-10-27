/**
 * Meadow. Grass along the foot of the page leans in gusts that roll across
 * it, with flowers in it, a second fainter bank behind for depth, clouds
 * drifting over the top and pollen in the air. Every so often a bunny comes
 * through, chaining hops and gaining speed with each one, which is the whole
 * idea of bunnyhopping. Move the cursor through the grass and it parts.
 */
import { put, stamp, stroke, rng, code, FINE, type Cells, type Pointer, type Scene } from "./engine";

/* Palette indices. Keep in step with `palette` below. */
const GRASS = 1, GRASS_DARK = 2, GRASS_FAR = 3, DRY = 4;
const PINK = 5, YELLOW = 6, VIOLET = 7, CLOUD = 8, POLLEN = 9, BUNNY = 10, BUNNY_EAR = 11;

const SIT = ["(\\(\\", "( -.-)", "o_(\")(\")"];
const AIR = ["(\\(\\", "( o.o)", "o_(\")_(\")"];

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

/** Smooth 2D value noise, 0..1. */
function noise(x: number, y: number) {
  const hash = (i: number, j: number) => {
    const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const i = Math.floor(x), j = Math.floor(y);
  const fx = x - i, fy = y - j;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

type Blade = { height: number; color: number; flower: number; flowerColor: number; phase: number };
type Mote = { x: number; y: number; vx: number; vy: number; life: number };
type Bunny = { x: number; y: number; vx: number; air: number; hops: number; rest: number; gone: boolean };

export const meadow: Scene = {
  font: 9,
  leading: 1.25,
  fps: 24,
  peak: [0.78, 0.7],
  underText: 0.3,
  palette: {
    light: ["#4c8a32", "#2f6a2a", "#93b98a", "#b89a3c", "#de5f8a", "#d9a514", "#7d5cc4", "#7f9bb3", "#c99a1c", "#3a3c40", "#d06a85"],
    dark: ["#6fb34f", "#3f8a3a", "#2f5a34", "#d8b44e", "#ff92b8", "#ffd23f", "#b59cff", "#4d6676", "#ffd86a", "#d9dcd6", "#ffb3c4"],
  },

  create(cells: Cells, width: number, height: number) {
    const { cols, rows, cw, ch } = cells;
    const random = rng(11);

    /* Grass fills about the bottom quarter, deeper on tall screens. */
    const band = Math.max(8, Math.round(rows * 0.26));
    const ground = rows - 1;

    const near: Blade[] = [];
    const far: Blade[] = [];
    for (let c = 0; c < cols; c++) {
      const hill = noise(c * 0.035, 3.1);
      const pick = random();
      /* Tufts, not a fence: some columns stay short so the bank has gaps. */
      const tuft = random() < 0.3 ? 0.35 : 1;
      near.push({
        height: Math.round((band * (0.3 + 0.6 * hill) + random() * band * 0.35) * tuft),
        color: pick < 0.1 ? DRY : pick < 0.55 ? GRASS : GRASS_DARK,
        flower: random() < 0.07 ? 1 : 0,
        flowerColor: [PINK, YELLOW, VIOLET][Math.floor(random() * 3)],
        phase: random() * 6,
      });
      far.push({
        height: Math.round(band * (0.55 + 0.5 * noise(c * 0.02, 9.7)) + random() * 3),
        color: GRASS_FAR,
        flower: 0,
        flowerColor: 0,
        phase: random() * 6,
      });
    }

    const motes: Mote[] = Array.from({ length: Math.round(cols / 5) }, () => ({
      x: random() * width,
      y: height - random() * band * ch * 2.2,
      vx: 0,
      vy: 0,
      life: random(),
    }));

    let clock = 0;
    const bunny: Bunny = { x: -80, y: 0, vx: 0, air: 0, hops: 0, rest: 2, gone: true };
    let nextBunny = 3;

    /* Lean of a blade at column c, -1..1: travelling gusts plus the cursor. */
    const lean = (c: number, pointer: Pointer, phase: number) => {
      const x = c * cw;
      const t = clock;
      let w = 0.38 + 0.42 * Math.sin(x * 0.005 - t * 1.05) + 0.22 * Math.sin(x * 0.013 - t * 2.1 + phase * 0.2);
      w += 0.06 * Math.sin(t * 3.1 + phase);
      if (pointer.inside && pointer.y > height - band * ch * 1.4) {
        const dx = x - pointer.x;
        const near = Math.exp(-(dx * dx) / (2 * 60 * 60));
        w += Math.sign(dx) * near * 0.9;
      }
      return clamp(w, -1, 1);
    };

    let lastPointer: Pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, inside: false, taps: [] };

    const drawBank = (cells: Cells, blades: Blade[], baseRow: number, inkScale: number, front: boolean) => {
      for (let c = 0; c < cols; c++) {
        const blade = blades[c];
        const w = lean(c, lastPointer, blade.phase) * (front ? 1 : 0.6);
        for (let k = 0; k < blade.height; k++) {
          const up = k / Math.max(1, blade.height - 1);
          /* The top of a blade bends further than its root. */
          const bend = w * up * up;
          const col = c + Math.round(bend * 2.2);
          const row = baseRow - k;
          const angle = -Math.PI / 2 + bend * 1.1;
          const tip = k === blade.height - 1;
          let glyph = tip ? (Math.abs(bend) > 0.25 ? stroke(angle) : code("'")) : stroke(angle);
          if (k === 0) glyph = code(front ? "|" : ",");
          const ink = (0.6 + (1 - up) * 0.4) * inkScale;
          put(cells, col, row, glyph, ink, blade.color);
          if (tip && blade.flower) {
            put(cells, col, row - 1, code("*"), 0.95 * inkScale, blade.flowerColor);
            put(cells, col - 1, row - 1, code("("), 0.6 * inkScale, blade.flowerColor);
            put(cells, col + 1, row - 1, code(")"), 0.6 * inkScale, blade.flowerColor);
          }
        }
      }
    };

    const drawSprite = (cells: Cells, lines: string[], col: number, row: number) => {
      lines.forEach((line, i) => {
        for (let j = 0; j < line.length; j++) {
          const ch = line[j];
          if (ch === " ") continue;
          const color = i === 0 ? BUNNY_EAR : ch === "o" && i === 2 && j === 0 ? BUNNY_EAR : BUNNY;
          stamp(cells, col + j, row + i, ch, 1, color);
        }
      });
    };

    return {
      step(dt: number, pointer: Pointer) {
        clock += dt;
        lastPointer = pointer;

        /* Pollen rides the same wind as the grass. */
        for (const m of motes) {
          const w = lean(Math.floor(m.x / cw), pointer, 0);
          m.vx += (w * 40 + 6 - m.vx) * dt;
          m.vy += (Math.sin(clock * 0.8 + m.x * 0.01) * 6 - m.vy) * dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.life += dt * 0.05;
          if (m.x > width + 10) m.x = -10;
          if (m.x < -10) m.x = width + 10;
        }

        for (const tap of pointer.taps) {
          if (bunny.gone) {
            Object.assign(bunny, { x: tap.x - 30, vx: 90, air: 0, hops: 0, rest: 0, gone: false });
          }
        }

        /* The bunny. On the ground it rests or launches; each hop chained
           without a rest carries more speed, up to a cap. */
        if (bunny.gone) {
          if (clock > nextBunny) Object.assign(bunny, { x: -60, vx: 70, air: 0, hops: 0, rest: 0.4, gone: false });
        } else {
          const startled =
            pointer.inside && Math.abs(pointer.x - bunny.x) < 120 && pointer.y > height - band * ch * 1.6;
          if (bunny.air > 0) {
            bunny.air -= dt;
            bunny.x += bunny.vx * dt;
            if (bunny.air <= 0) {
              bunny.air = 0;
              bunny.rest = startled || bunny.hops < 3 + Math.floor(random() * 4) ? 0.06 : 0.9 + random() * 2.2;
              if (bunny.rest > 0.5) bunny.hops = 0;
            }
          } else if ((bunny.rest -= dt) <= 0) {
            bunny.hops += 1;
            bunny.vx = Math.min(260, 70 * Math.pow(1.12, bunny.hops)) * (startled ? 1.5 : 1);
            bunny.air = 0.5;
          }
          if (bunny.x > width + 80) {
            bunny.gone = true;
            nextBunny = clock + 8 + random() * 10;
          }
        }
      },

      draw(cells: Cells) {
        /* Clouds over the top third: soft noise, banded into a few glyphs. */
        const top = Math.round(rows * 0.34);
        for (let r = 0; r < top; r++) {
          for (let c = 0; c < cols; c++) {
            const n = noise(c * 0.03 - clock * 0.12, r * 0.09) * 0.65 + noise(c * 0.07 - clock * 0.2, r * 0.2 + 5) * 0.35;
            const v = (n - 0.58) * 3.2 * (1 - r / top) * 1.4;
            if (v <= 0.05) continue;
            put(cells, c, r, code(FINE[1 + Math.min(8, Math.floor(v * 8))]), 0.3 + v * 0.5, CLOUD);
          }
        }

        for (const m of motes) {
          const twinkle = 0.5 + 0.5 * Math.sin(m.life * 40);
          put(cells, m.x / cw, m.y / ch, twinkle > 0.8 ? code("*") : code("."), 0.35 + twinkle * 0.5, POLLEN);
        }

        drawBank(cells, far, ground - Math.round(band * 0.35), 0.6, false);
        drawBank(cells, near, ground, 1, true);
        /* Thatch at the roots, so the bank has weight at the bottom. */
        for (let r = ground - 1; r <= ground; r++) {
          for (let c = 0; c < cols; c++) {
            const n = noise(c * 0.4, r * 0.7);
            put(cells, c, r, code(FINE[12 + Math.floor(n * 7)]), 0.7 + n * 0.3, n > 0.6 ? DRY : GRASS_DARK);
          }
        }

        if (!bunny.gone) {
          const hop = bunny.air > 0 ? Math.sin((1 - bunny.air / 0.5) * Math.PI) : 0;
          const rise = hop * (2.2 + Math.min(3, bunny.hops * 0.4));
          const row = ground - Math.round(band * 0.45) - 2 - Math.round(rise);
          drawSprite(cells, bunny.air > 0 ? AIR : SIT, Math.floor(bunny.x / cw), row);
        }
      },
    };
  },
};
