/**
 * Starlings at dusk. A murmuration of a few hundred birds turns over a sunset
 * sky: each bird follows the usual three rules (keep apart, match heading,
 * stay with the flock) and the flock as a whole drifts after a slow,
 * wandering point. The cursor is a hawk; the flock folds away from it.
 *
 * Where birds are thick the cell is drawn by count from the ramp; a lone bird
 * flaps between v and - on its own beat. Their colour shifts with heading,
 * the way a starling's plumage catches the light as it turns.
 */
import { put, rng, code, FINE, type Cells, type Pointer, type Scene } from "./engine";

/* Palette indices. Keep in step with `palette` below. */
const SKY_LOW = 1, SKY_MID = 2, SKY_HIGH = 3, SUN = 4;
const BIRD = [5, 6, 7, 8];

type Bird = { x: number; y: number; vx: number; vy: number; flap: number };

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export const starlings: Scene = {
  font: 9,
  leading: 1.25,
  fps: 30,
  peak: [0.72, 0.62],
  underText: 0.3,
  palette: {
    light: ["#e79a6b", "#e3a7a7", "#a9b4d6", "#e7a43a", "#24262c", "#33405a", "#3c2f52", "#2c4a46"],
    dark: ["#c56a43", "#a15f78", "#3a4a78", "#ffb347", "#d7dbe3", "#9fb6e0", "#c4a8ef", "#9ad6c8"],
  },

  create(cells: Cells, width: number, height: number) {
    const { cols, rows, cw, ch } = cells;
    const random = rng(23);
    const count = Math.round(clamp((width * height) / 2200, 300, 700));

    const birds: Bird[] = Array.from({ length: count }, () => {
      const a = random() * Math.PI * 2;
      return {
        x: width * (0.55 + (random() - 0.5) * 0.3),
        y: height * (0.35 + (random() - 0.5) * 0.25),
        vx: Math.cos(a) * 80,
        vy: Math.sin(a) * 80,
        flap: random() * 6,
      };
    });

    /* A coarse grid so each bird only checks its neighbours. */
    const CELL = 48;
    const gw = Math.ceil(width / CELL) + 2, gh = Math.ceil(height / CELL) + 2;
    const buckets: number[][] = Array.from({ length: gw * gh }, () => []);
    const density = new Uint16Array(cols * rows);

    let clock = random() * 100;

    return {
      step(dt: number, pointer: Pointer) {
        clock += dt;
        for (const b of buckets) b.length = 0;
        birds.forEach((b, i) => {
          const gx = clamp(Math.floor(b.x / CELL) + 1, 0, gw - 1), gy = clamp(Math.floor(b.y / CELL) + 1, 0, gh - 1);
          buckets[gy * gw + gx].push(i);
        });

        /* Where the flock is headed: a slow figure that keeps it on screen,
           mostly off to the right where the copy isn't. */
        const t = clock * 0.07;
        const goal = {
          x: width * (0.7 + 0.2 * Math.sin(t * 1.3) + 0.05 * Math.sin(t * 3.7)),
          y: height * (0.36 + 0.18 * Math.sin(t * 2.1 + 1) + 0.05 * Math.cos(t * 4.3)),
        };

        for (const b of birds) {
          let ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0, n = 0;
          const gx = clamp(Math.floor(b.x / CELL) + 1, 0, gw - 1), gy = clamp(Math.floor(b.y / CELL) + 1, 0, gh - 1);
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const bucket = buckets[clamp(gy + oy, 0, gh - 1) * gw + clamp(gx + ox, 0, gw - 1)];
              for (const j of bucket) {
                const o = birds[j];
                if (o === b) continue;
                const dx = o.x - b.x, dy = o.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 > CELL * CELL) continue;
                n++;
                ax += o.vx;
                ay += o.vy;
                cx += dx;
                cy += dy;
                if (d2 < 196) {
                  sx -= dx / (d2 + 1);
                  sy -= dy / (d2 + 1);
                }
              }
            }
          }
          let fx = 0, fy = 0;
          if (n) {
            fx += (ax / n - b.vx) * 2.2 + (cx / n) * 1.1 + sx * 1400;
            fy += (ay / n - b.vy) * 2.2 + (cy / n) * 1.1 + sy * 1400;
          }
          /* Pulled harder the further out a bird strays, so the flock stays
             one body instead of a scatter. */
          const gx2 = goal.x - b.x, gy2 = goal.y - b.y;
          const far = Math.min(3, Math.hypot(gx2, gy2) / 160);
          fx += gx2 * 0.1 * (1 + far);
          fy += gy2 * 0.1 * (1 + far);

          /* The hawk. */
          if (pointer.inside) {
            const dx = b.x - pointer.x, dy = b.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 140 * 140) {
              const d = Math.sqrt(d2) + 1;
              fx += (dx / d) * 900 * (1 - d / 140);
              fy += (dy / d) * 900 * (1 - d / 140);
            }
          }

          b.vx += fx * dt;
          b.vy += fy * dt;
          const speed = Math.hypot(b.vx, b.vy) || 1;
          const target = clamp(speed, 80, 140);
          b.vx *= target / speed;
          b.vy *= target / speed;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.flap += dt * (9 + (speed - 70) * 0.04);
        }
      },

      draw(cells: Cells) {
        /* Dusk: sparse dots banded by height, warm at the horizon. */
        const sunC = Math.round(cols * 0.8), sunR = Math.round(rows * 0.86);
        for (let r = 0; r < rows; r++) {
          const fall = r / rows;
          const color = fall > 0.72 ? SKY_LOW : fall > 0.5 ? SKY_MID : SKY_HIGH;
          const every = fall > 0.72 ? 3 : fall > 0.5 ? 5 : 9;
          for (let c = (r * 7) % every; c < cols; c += every) {
            const glow = fall > 0.5 ? (fall - 0.5) * 0.6 : 0.06;
            put(cells, c, r, code(fall > 0.8 ? "-" : "."), 0.16 + glow * 0.7, color);
          }
        }
        /* The low sun, half set. */
        for (let r = sunR - 5; r <= sunR + 1; r++) {
          for (let c = sunC - 12; c <= sunC + 12; c++) {
            const d = Math.hypot((c - sunC) * (cw / ch), r - sunR) / 5.2;
            if (d > 1) continue;
            put(cells, c, r, code(FINE[Math.round((1 - d) * 6) + 8]), 0.35 + (1 - d) * 0.35, SUN);
          }
        }

        density.fill(0);
        for (const b of birds) {
          const c = Math.floor(b.x / cw), r = Math.floor(b.y / ch);
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          density[r * cols + c]++;
        }
        for (const b of birds) {
          const c = Math.floor(b.x / cw), r = Math.floor(b.y / ch);
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const n = density[r * cols + c];
          /* Heading picks the sheen. */
          const turn = (Math.atan2(b.vy, b.vx) + Math.PI) / (Math.PI * 2);
          const color = BIRD[Math.floor(turn * 4) % 4];
          const glyph = n === 1 ? code(Math.sin(b.flap) > 0 ? "v" : "-") : code(FINE[clamp(9 + n * 2, 0, FINE.length - 1)]);
          put(cells, c, r, glyph, clamp(0.6 + n * 0.1), color);
        }
      },
    };
  },
};
