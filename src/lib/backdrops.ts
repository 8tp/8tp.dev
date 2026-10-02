/**
 * Backdrop shaders. Each variant is one fragment shader that outputs ink at a
 * low alpha over the paper (premultiplied: rgb = ink * a). Backdrop.astro
 * hosts whichever is picked and feeds the uniforms documented there.
 *
 * Keep every variant faint enough to sit behind 15px body text: peak alpha
 * around 0.05–0.10, and nothing that moves fast enough to pull the eye.
 */

export type Backdrop = {
  fragment: string;
  /** Multiplier on real seconds before it reaches u_time. */
  speed?: number;
  /** Canvas resolution as a fraction of device pixels (capped at 2x). */
  resolution?: number;
  /** Starting time, so the first frame isn't the noise origin. */
  seed?: number;
};

export const VERTEX = /* glsl */ `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/** Shared header: precision, uniforms, and a 3D simplex noise. */
const HEAD = /* glsl */ `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_ink;
uniform vec3 u_paper;
uniform float u_dark;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
    i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
    i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

/* Soft hill under the cursor, 0..1. radius in CSS-ish units of u_res.y. */
float cursorHill(vec2 frag, float radius) {
  vec2 d = (frag - u_mouse) / u_res.y;
  return exp(-dot(d, d) / (2.0 * radius * radius));
}

/*
 * Output helper: ink at alpha a, premultiplied. At these alphas the whole
 * ramp from paper to ink spans a dozen 8-bit steps, so a half-step of noise
 * is added to break up banding.
 */
vec4 inkAt(float a) {
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  a = max(0.0, a + (n - 0.5) / 255.0);
  return vec4(u_ink * a, a);
}

float fbm(vec3 p) {
  float sum = 0.0, amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * snoise(p);
    p = vec3(p.xy * 2.03, p.z * 1.4);
    amp *= 0.5;
  }
  return sum;
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}
`;

const fragment = (body: string) => HEAD + body;

export const backdrops: Record<string, Backdrop> = {
  /*
   * Topographic lines, now on the GPU: smooth at any frame rate, and fainter
   * than the canvas version. Lines are drawn from the field's own derivative,
   * so they stay one pixel wide however steep the slope.
   */
  contours: {
    speed: 0.035,
    resolution: 0.75,
    seed: 17,
    fragment: fragment(/* glsl */ `
void main() {
  vec2 p = gl_FragCoord.xy / u_res.y;
  float f = snoise(vec3(p * 1.6, u_time)) + 0.5 * snoise(vec3(p * 3.4, u_time * 1.3));
  f += 0.45 * cursorHill(gl_FragCoord.xy, 0.16);
  float bands = f * 6.0;
  float line = abs(fract(bands) - 0.5) / fwidth(bands);
  float a = 1.0 - smoothstep(0.0, 1.2, line);
  /* Every fourth line a little heavier, like index contours on a map. */
  float index = 1.0 - step(0.5, mod(floor(bands + 0.5), 4.0));
  a *= mix(0.045, 0.08, index);
  gl_FragColor = inkAt(a);
}
`),
  },

  /*
   * Window light. The page sits near a window: slatted blinds and a tree
   * outside throw a soft shadow across it, and the leaves move in a light
   * breeze. In the light theme the shadow is drawn; in the dark theme it is
   * the light that falls through, like a street lamp at night.
   */
  window: {
    speed: 1,
    resolution: 0.5,
    seed: 4,
    fragment: fragment(/* glsl */ `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = gl_FragCoord.xy / u_res.y;

  /* The window's light falls as a skewed band from the upper right. */
  vec2 q = vec2(p.x * 0.94 + p.y * 0.34, p.y - p.x * 0.12);
  float pane = smoothstep(0.0, 0.35, uv.x + uv.y * 0.6 - 0.55) * smoothstep(1.9, 1.2, uv.x + uv.y);

  /* Blind slats: thin, evenly spaced shadow lines with soft penumbras. */
  float slat = fract(q.y * 26.0 + sin(u_time * 0.18) * 0.08);
  float blind = smoothstep(0.0, 0.08, slat) * smoothstep(0.42, 0.30, slat);

  /* Leaves: clustered, swaying shapes with blurred edges. */
  vec2 sway = vec2(sin(u_time * 0.41) + 0.4 * sin(u_time * 1.13), cos(u_time * 0.33)) * 0.018;
  float canopy = fbm(vec3((p + sway) * 3.1, u_time * 0.035)) + 0.25 * snoise(vec3(p * 9.0 + sway * 4.0, 2.0));
  float leaf = smoothstep(0.08, 0.22, canopy);

  float shadow = clamp(blind + leaf * 0.8, 0.0, 1.0) * pane;
  float light = (1.0 - clamp(blind + leaf, 0.0, 1.0)) * pane;

  float a = mix(shadow * 0.055, light * 0.06, u_dark);
  gl_FragColor = inkAt(a);
}
`),
  },

  /*
   * Raking light. The paper is given a surface (fibres, laid lines, a slight
   * cockle) and a low light slowly circles the page, so the grain catches and
   * loses it. Nothing on the page moves; only the light does.
   */
  paper: {
    speed: 0.05,
    resolution: 1,
    seed: 2,
    fragment: fragment(/* glsl */ `
float surface(vec2 p) {
  float fibre = snoise(vec3(p.x * 60.0, p.y * 140.0, 1.0)) * 0.18
              + snoise(vec3(p.x * 150.0, p.y * 90.0, 5.0)) * 0.12;
  float cockle = snoise(vec3(p * 1.1, 3.0)) * 2.4 + snoise(vec3(p * 2.7, 8.0)) * 0.8;
  float laid = 0.0;
  return fibre + laid + cockle;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_res.y;
  float h = surface(p);
  vec3 n = normalize(vec3(-dFdx(h), -dFdy(h), 0.18));

  /* A low light circling the page once every couple of minutes. */
  vec3 L = normalize(vec3(cos(u_time), sin(u_time), 0.55));
  float lit = dot(n, L) - L.z * n.z;

  /* Strongest where the light pool currently is, so the raking travels. */
  vec2 centre = vec2(0.5 * u_res.x / u_res.y, 0.5) - 0.55 * L.xy;
  float pool = exp(-dot(p - centre, p - centre) * 1.1);

  float a = mix(max(-lit, 0.0) * 0.07, max(lit, 0.0) * 0.06, u_dark) * (0.25 + 0.75 * pool);
  gl_FragColor = inkAt(a);
}
`),
  },

  /*
   * Suminagashi: ink rings floated on water and drawn through with a comb,
   * the oldest way of marbling paper. The rings sit off to the right and the
   * strokes sway slowly, so the pattern keeps re-forming. The transforms are
   * Jaffer's closed-form marbling operations, run in reverse per pixel.
   */
  marbling: {
    speed: 1,
    resolution: 0.75,
    fragment: fragment(/* glsl */ `
vec2 untine(vec2 p, vec2 o, vec2 dir, float z, float c) {
  float d = abs(dot(p - o, vec2(-dir.y, dir.x)));
  return p - dir * z * c / (d + c);
}

void main() {
  vec2 p = gl_FragCoord.xy / u_res.y;
  float t = u_time;
  p = untine(p, vec2(0.0, 0.3), normalize(vec2(1.0, 0.25)), 0.09 * sin(t * 0.07 + 1.0), 0.10);
  p = untine(p, vec2(0.0, 0.62), vec2(1.0, 0.0), 0.12 * sin(t * 0.05), 0.06);
  p += 0.01 * vec2(snoise(vec3(p * 1.5, t * 0.03)), snoise(vec3(p * 1.5 + 7.0, t * 0.03)));
  vec2 c = vec2(u_res.x / u_res.y - 0.35, 0.55);
  float k = dot(p - c, p - c) * 120.0;
  /* Thin rings rather than filled bands: drawn, not printed. */
  float ring = abs(fract(k * 0.5) - 0.5) / max(fwidth(k * 0.5), 1e-4);
  float line = 1.0 - smoothstep(0.6, 1.6, ring);
  float a = line * 0.06 * (1.0 - smoothstep(20.0, 70.0, k));
  gl_FragColor = inkAt(a * mix(1.0, 0.75, u_dark));
}
`),
  },

  /*
   * Guilloche: the engraved rosette from banknotes and share certificates,
   * centred just off the right edge. Tone is carried by line weight rather
   * than opacity, the way an engraver would, and the rosette breathes.
   */
  guilloche: {
    speed: 1,
    resolution: 1,
    fragment: fragment(/* glsl */ `
void main() {
  vec2 p = gl_FragCoord.xy / u_res.y;
  float t = u_time * 0.05;
  vec2 d = p - vec2(u_res.x / u_res.y + 0.1, 0.3);
  float r = length(d), th = atan(d.y, d.x);
  float wob = 0.03 * sin(th * 36.0 + t * 2.0) + 0.015 * sin(th * 11.0 - t);
  float f1 = (r + wob) * 55.0, f2 = (r - wob) * 55.0;
  float fw = fwidth(r) * 55.0;
  float tone = 0.5 + 0.5 * snoise(vec3(p * 1.2, t * 0.5));
  float w = 0.15 + 0.5 * tone;
  float l1 = 1.0 - smoothstep(w, w + 1.0, abs(fract(f1) - 0.5) / fw);
  float l2 = 1.0 - smoothstep(w, w + 1.0, abs(fract(f2) - 0.5) / fw);
  float a = max(l1, l2) * 0.045 * smoothstep(0.25, 0.55, r) * (1.0 - smoothstep(0.75, 1.15, r));
  gl_FragColor = inkAt(a * mix(1.0, 0.75, u_dark));
}
`),
  },
};
