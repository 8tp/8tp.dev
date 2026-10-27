/**
 * The ASCII backdrop engine. A scene simulates on the CPU at cell resolution
 * (tens of thousands of cells, still cheap) and writes a glyph, an ink level
 * and a palette colour per cell. The GPU then draws every glyph in a single
 * pass from an atlas, so there is no DOM text and no per-glyph fillText.
 *
 * Colour comes from a palette the scene declares twice, once for each theme:
 * the same orange has to be deeper on warm paper and brighter on the dark
 * green-black. Entry 0 is always the theme's own ink.
 *
 * Craft rules taken from the ASCII pieces that went round on X in October 2026
 * (the ascii-sharks ocean and the koi ponds that answered it):
 *
 * - Ink is quantised to a handful of levels, so glyphs don't shimmer as values
 *   cross a threshold every frame.
 * - Scenes step on a fixed clock, well below the display rate. ASCII reads as
 *   set type when it ticks, and the CPU work halves.
 * - Glyphs fade under the text column; the art lives in the margins.
 * - Paused when hidden. Reduced motion gets one settled still.
 */

/** Printable ASCII, so a glyph index is its char code minus 32. */
const FIRST = 32;
const COUNT = 95;

export type Cells = {
  cols: number;
  rows: number;
  /** Cell size in CSS pixels. */
  cw: number;
  ch: number;
  /** Glyph per cell, as `charCode - 32`. 0 is a space. */
  glyph: Uint8Array;
  /** Ink per cell, 0..255, quantised on upload. */
  ink: Uint8Array;
  /** Palette index per cell. 0 is the theme ink. */
  color: Uint8Array;
  /**
   * A solid block behind the glyph: palette index and opacity, 0..255. Bodies
   * that should read as solid (the way ascii-sharks paints skin as shaded
   * blocks with a glyph on top) set these; empty water or grass leaves them 0.
   */
  block: Uint8Array;
  blockInk: Uint8Array;
};

export type Pointer = {
  /** CSS pixels, viewport space. */
  x: number;
  y: number;
  /** Eased velocity in CSS px per second. */
  vx: number;
  vy: number;
  /** False until the pointer has moved, and after it leaves the window. */
  inside: boolean;
  /** Taps since the last step, consumed by the scene. */
  taps: { x: number; y: number }[];
};

/**
 * Where the viewport sits on the page. The canvas is fixed, so a scene that
 * wants to live on the page rather than the screen (things you scroll past)
 * places itself with these.
 */
export type View = {
  /** Scroll offset, CSS px. */
  y: number;
  /** Full page height, CSS px. */
  height: number;
  /** Eased scroll velocity, CSS px per second (positive scrolling down). */
  vy: number;
};

export type SceneState = {
  /** Advance by dt seconds (always the fixed step). */
  step(dt: number, pointer: Pointer, view: View): void;
  /** Write the current frame into the cells. Called after a step, and on every frame while scrolling. */
  draw(cells: Cells, view: View): void;
};

export type Scene = {
  /** Font size in CSS px; the cell is measured from it. */
  font?: number;
  /** Font weight for the atlas. Heavier glyphs hold up better at small sizes. */
  weight?: number;
  /** Line height as a multiple of the font size. */
  leading?: number;
  /** Simulation steps per second. */
  fps?: number;
  /** Peak opacity for ink 255, in the light and dark themes. */
  peak?: [light: number, dark: number];
  /** How much ink survives under the text column, 0..1. */
  underText?: number;
  /** Colours by index, from 1 (0 is the theme ink). Hex, one list per theme. */
  palette?: { light: string[]; dark: string[] };
  /** Build fresh state for a viewport of this many cells. */
  create(cells: Cells, width: number, height: number, view: View): SceneState;
};

/* --------------------------------------------------------------- helpers */

export const code = (char: string) => Math.max(0, Math.min(COUNT - 1, char.charCodeAt(0) - FIRST));

/** Write a glyph, keeping whichever of the old and new has more ink. */
export function put(cells: Cells, col: number, row: number, char: string | number, ink: number, color = 0) {
  col = Math.floor(col);
  row = Math.floor(row);
  if (col < 0 || row < 0 || col >= cells.cols || row >= cells.rows) return;
  const i = row * cells.cols + col;
  const level = Math.max(0, Math.min(255, ink * 255));
  if (level <= cells.ink[i]) return;
  cells.ink[i] = level;
  cells.glyph[i] = typeof char === "number" ? char : code(char);
  cells.color[i] = color;
}

/** Paint the block behind a cell, keeping the denser of old and new. */
export function block(cells: Cells, col: number, row: number, color: number, ink: number) {
  col = Math.floor(col);
  row = Math.floor(row);
  if (col < 0 || row < 0 || col >= cells.cols || row >= cells.rows) return;
  const i = row * cells.cols + col;
  const level = Math.max(0, Math.min(255, ink * 255));
  if (level <= cells.blockInk[i]) return;
  cells.blockInk[i] = level;
  cells.block[i] = color;
}

/**
 * Cheap integer hash to 0..1. Deterministic, so a glyph picked by hashing a
 * position on a body (rather than on the screen) rides along with that body
 * instead of re-rolling every frame. From ascii-sharks by @stackedlol (MIT,
 * github.com/stackedlol/ascii-sharks).
 */
export function hash3(x: number, y: number, z: number) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Write unconditionally: sprites that must sit on top of whatever is there. */
export function stamp(cells: Cells, col: number, row: number, char: string | number, ink: number, color = 0) {
  col = Math.floor(col);
  row = Math.floor(row);
  if (col < 0 || row < 0 || col >= cells.cols || row >= cells.rows) return;
  const i = row * cells.cols + col;
  cells.ink[i] = Math.max(0, Math.min(255, ink * 255));
  cells.glyph[i] = typeof char === "number" ? char : code(char);
  cells.color[i] = color;
}

/**
 * Sparse to dense, symbols only. Bourke's 70-step ramp was tried first: it is
 * mostly letters, and behind real copy a body of letters reads as gibberish
 * text rather than shading. These carry the gradient without looking like
 * words.
 */
export const FINE = " .'`,:;~-=+*xo%#&8@";

/** Pick from a ramp by a 0..1 value. */
export const ramp = (chars: string, v: number) =>
  code(chars[Math.max(0, Math.min(chars.length - 1, Math.floor(v * chars.length)))]);

/**
 * The stroke that best draws a line at this angle (radians, y down). This is
 * the one place direction turns into a glyph, so ripples, fins, grass and
 * contour lines all lean the same way.
 */
export function stroke(angle: number) {
  let a = angle % Math.PI;
  if (a < 0) a += Math.PI;
  const step = Math.round(a / (Math.PI / 4)) % 4;
  return code(["-", "\\", "|", "/"][step]);
}

/** Small seeded PRNG so a scene lays out the same way for a given seed. */
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------- shaders */

const VERTEX = /* glsl */ `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENT = /* glsl */ `
precision mediump float;
uniform sampler2D u_cells;  /* RGBA: glyph index, ink, palette index, block ink */
uniform sampler2D u_blocks; /* LUMINANCE: block palette index */
uniform sampler2D u_atlas;  /* one row of glyphs, coverage in alpha */
uniform sampler2D u_palette; /* 256 x 1, entry 0 is the theme ink */
uniform vec2 u_res;         /* canvas, device px */
uniform vec2 u_grid;        /* cols, rows */
uniform vec2 u_cell;        /* cell, device px */
uniform float u_peak;
uniform vec3 u_column;      /* text column x0, x1 (device px), ink kept under it */

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 cell = floor(frag / u_cell);
  vec4 c = texture2D(u_cells, (cell + 0.5) / u_grid);
  float glyph = floor(c.r * 255.0 + 0.5);
  vec2 local = (frag - cell * u_cell) / u_cell;
  float cover = texture2D(u_atlas, vec2((glyph + local.x) / ${COUNT}.0, local.y)).a;

  /* Ease off under the text column, with a soft shoulder either side. */
  float edge = u_cell.x * 6.0;
  float inside = smoothstep(u_column.x - edge, u_column.x + edge, frag.x)
               * (1.0 - smoothstep(u_column.y - edge, u_column.y + edge, frag.x));
  float fade = u_peak * mix(1.0, u_column.z, inside);
  float a = cover * c.g * fade;
  vec3 ink = texture2D(u_palette, vec2((floor(c.b * 255.0 + 0.5) + 0.5) / 256.0, 0.5)).rgb;

  /* The block sits under the glyph, inset by a pixel so the grid shows. */
  vec2 inset = step(vec2(1.0), frag - cell * u_cell) * step(frag - cell * u_cell, u_cell - 1.0);
  float idx = floor(texture2D(u_blocks, (cell + 0.5) / u_grid).r * 255.0 + 0.5);
  vec3 under = texture2D(u_palette, vec2((idx + 0.5) / 256.0, 0.5)).rgb;
  float b = c.a * fade * inset.x * inset.y;

  /* Glyph over block, premultiplied. */
  gl_FragColor = vec4(ink * a + under * b * (1.0 - a), a + b * (1.0 - a));
}
`;

/* ------------------------------------------------------------------- host */

/** Ink is uploaded in this many steps, after the scene has drawn. */
const LEVELS = 8;

export function startAscii(canvas: HTMLCanvasElement, scene: Scene): boolean {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) return false;

  const root = document.documentElement;
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(program, n);
  const uRes = u("u_res"), uGrid = u("u_grid"), uCell = u("u_cell");
  const uPeak = u("u_peak"), uColumn = u("u_column");
  gl.uniform1i(u("u_cells"), 0);
  gl.uniform1i(u("u_atlas"), 1);
  gl.uniform1i(u("u_palette"), 2);
  gl.uniform1i(u("u_blocks"), 3);

  const texture = (unit: number) => {
    const t = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  const cellTex = texture(0);
  const atlasTex = texture(1);
  const paletteTex = texture(2);
  const blockTex = texture(3);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

  const dpr = Math.min(devicePixelRatio || 1, 2);
  const leading = scene.leading ?? 1.3;
  const mono = getComputedStyle(root).getPropertyValue("--font-mono").trim() || "monospace";

  let cells: Cells;
  let state: SceneState;
  let packed: Uint8Array;

  /** Glyphs drawn once into a strip, at exactly one device pixel per texel. */
  const buildAtlas = (font: number, cwDev: number, chDev: number) => {
    const atlas = document.createElement("canvas");
    atlas.width = cwDev * COUNT;
    atlas.height = chDev;
    const ctx = atlas.getContext("2d")!;
    ctx.font = `${scene.weight ?? 400} ${font * dpr}px ${mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    for (let i = 0; i < COUNT; i++) ctx.fillText(String.fromCharCode(FIRST + i), (i + 0.5) * cwDev, chDev / 2);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, atlasTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
  };

  /* Text column: the page shell, which is where every line of copy sits. */
  const column = () => {
    const shell = document.querySelector(".shell");
    const box = shell?.getBoundingClientRect();
    const x0 = box ? box.left : 0, x1 = box ? box.right : innerWidth;
    gl.uniform3f(uColumn, x0 * dpr, x1 * dpr, scene.underText ?? 0.35);
  };

  const readTheme = () => {
    const dark = root.dataset.theme === "dark";
    const ink = getComputedStyle(root).getPropertyValue("--ink").trim() || "#171816";
    const list = [ink, ...((dark ? scene.palette?.dark : scene.palette?.light) ?? [])];
    const rgba = new Uint8Array(256 * 4);
    list.slice(0, 256).forEach((hex, i) => {
      const n = parseInt(hex.slice(1), 16);
      rgba.set([(n >> 16) & 255, (n >> 8) & 255, n & 255, 255], i * 4);
    });
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, paletteTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    const [light, darkPeak] = scene.peak ?? [0.22, 0.2];
    gl.uniform1f(uPeak, dark ? darkPeak : light);
  };

  const build = () => {
    const font = scene.font ?? 12;
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = `${scene.weight ?? 400} ${font * dpr}px ${mono}`;
    const cwDev = Math.max(1, Math.round(probe.measureText("M").width));
    const chDev = Math.max(1, Math.round(font * leading * dpr));

    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width / cwDev);
    const rows = Math.ceil(canvas.height / chDev);
    cells = {
      cols,
      rows,
      cw: cwDev / dpr,
      ch: chDev / dpr,
      glyph: new Uint8Array(cols * rows),
      ink: new Uint8Array(cols * rows),
      color: new Uint8Array(cols * rows),
      block: new Uint8Array(cols * rows),
      blockInk: new Uint8Array(cols * rows),
    };
    packed = new Uint8Array(cols * rows * 4);
    state = scene.create(cells, innerWidth, innerHeight, readView());

    buildAtlas(font, cwDev, chDev);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uGrid, cols, rows);
    gl.uniform2f(uCell, cwDev, chDev);
    column();
  };

  const render = () => {
    cells.glyph.fill(0);
    cells.ink.fill(0);
    cells.color.fill(0);
    cells.block.fill(0);
    cells.blockInk.fill(0);
    state.draw(cells, view);
    const n = cells.cols * cells.rows;
    for (let i = 0; i < n; i++) {
      const level = Math.round((cells.ink[i] / 255) * LEVELS);
      packed[i * 4] = level ? cells.glyph[i] : 0;
      packed[i * 4 + 1] = Math.round((level / LEVELS) * 255);
      packed[i * 4 + 2] = cells.color[i];
      packed[i * 4 + 3] = Math.round(Math.round((cells.blockInk[i] / 255) * LEVELS) * (255 / LEVELS));
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cellTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cells.cols, cells.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, packed);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, blockTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, cells.cols, cells.rows, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, cells.block);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const readView = (): View => ({ y: scrollY, height: document.documentElement.scrollHeight, vy: 0 });
  const view: View = readView();

  /* Pointer, in CSS px. Velocity is eased so a flick reads as one gesture. */
  const pointer: Pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, inside: false, taps: [] };
  let lastMove = 0;
  addEventListener(
    "pointermove",
    (e) => {
      const now = performance.now();
      const dt = Math.max(8, now - lastMove) / 1000;
      if (pointer.inside && dt < 0.25) {
        pointer.vx += ((e.clientX - pointer.x) / dt - pointer.vx) * 0.3;
        pointer.vy += ((e.clientY - pointer.y) / dt - pointer.vy) * 0.3;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      lastMove = now;
    },
    { passive: true },
  );
  addEventListener("pointerdown", (e) => pointer.taps.push({ x: e.clientX, y: e.clientY }), { passive: true });
  root.addEventListener("pointerleave", () => {
    pointer.inside = false;
    pointer.vx = pointer.vy = 0;
  });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fps = scene.fps ?? 30;

  /* Scroll position and an eased velocity, read once per frame. */
  let lastScrollY = scrollY, lastScrollAt = performance.now();
  const sampleScroll = (now: number) => {
    const elapsed = Math.max(1, now - lastScrollAt) / 1000;
    const raw = (scrollY - lastScrollY) / elapsed;
    view.vy += (raw - view.vy) * Math.min(1, elapsed * 10);
    const moved = scrollY !== view.y;
    view.y = scrollY;
    view.height = document.documentElement.scrollHeight;
    lastScrollY = scrollY;
    lastScrollAt = now;
    return moved;
  };
  const dt = 1 / fps;
  let acc = 0;
  let last = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    acc += Math.min(0.25, (now - last) / 1000);
    last = now;
    const scrolled = sampleScroll(now);
    /* While the page moves, redraw every frame so the scene keeps up with
       the copy; otherwise only when the simulation has stepped. */
    if (acc < dt) {
      if (scrolled) render();
      return;
    }
    while (acc >= dt) {
      /* The pointer's velocity dies away when it stops moving. */
      if (now - lastMove > 80) {
        pointer.vx *= 0.8;
        pointer.vy *= 0.8;
      }
      state.step(dt, pointer, view);
      pointer.taps.length = 0;
      acc -= dt;
    }
    render();
  };

  /** A still for reduced motion: let the scene settle, then draw once. */
  const still = () => {
    for (let i = 0; i < fps * 8; i++) state.step(dt, { ...pointer, inside: false, taps: [] }, { ...view, vy: 0 });
    render();
  };

  const start = () => {
    cancelAnimationFrame(raf);
    last = performance.now();
    acc = 0;
    if (reduced.matches) still();
    else raf = requestAnimationFrame(frame);
  };

  build();
  readTheme();

  let lastW = innerWidth, lastH = innerHeight;
  addEventListener("resize", () => {
    if (innerWidth === lastW && Math.abs(innerHeight - lastH) < lastH * 0.15) return;
    lastW = innerWidth;
    lastH = innerHeight;
    build();
    if (reduced.matches) still();
  });
  new MutationObserver(() => {
    readTheme();
    if (reduced.matches) render();
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener("visibilitychange", () => (document.hidden ? cancelAnimationFrame(raf) : start()));
  reduced.addEventListener("change", start);
  /* With reduced motion nothing animates, but the still still scrolls. */
  addEventListener("scroll", () => reduced.matches && (sampleScroll(performance.now()), render()), { passive: true });
  start();
  return true;
}
