/**
 * One line-drawn mark per project, keyed by slug.
 *
 * These are drawn here rather than pulled from each project's own favicon.
 * The live favicons (instagib.win, palhelm.com, coup, vitals, aim, duel, ant)
 * are full-colour tiles at seven different grid sizes, and nine of the sixteen
 * entries — the CLIs, the TUIs, the native apps — have no icon at all. Dropped
 * into the list raw they would read as a ransom note with holes in it.
 *
 * So each mark is redrawn in the site's own hand: 24x24, `currentColor`, one
 * stroke weight, no fill except the deliberate dots. Where a project already
 * has an identity the mark quotes it — Instagib's crosshair, Palhelm's ticked
 * helm ring, HudAim's concentric rings, Coup's crown, Vitals' gauge and pulse.
 * Where there is none, the mark is drawn from what the thing does.
 *
 * The value is the *inner* markup only; Mark.svelte supplies the <svg> shell,
 * so the viewBox and stroke can never drift entry to entry.
 */

export const marks: Record<string, string> = {
  /* Crosshair — the railgun reticle, straight off instagib.win. */
  "instagib-arena": `
    <circle cx="12" cy="12" r="6.5" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />`,

  /* Palhelm's own sphere-wheel, rescaled off its favicon: ticked ring, and the
     lower-left half solid. The solid half is doing real work — a wheel drawn in
     line alone is the crosshair above it at 22px, and these two sit adjacent.
     Drop the fill and the diagonal reads as a no-entry bar instead. */
  palhelm: `
    <path d="M7.05 16.95A7 7 0 1 1 16.95 7.05Z" fill="currentColor" fill-opacity="0.32" stroke="none" />
    <circle cx="12" cy="12" r="7" />
    <path d="M7.05 16.95 16.95 7.05" />
    <path d="M12 2.5v2.5M12 19v2.5M2.5 12h2.5M19 12h2.5" />`,

  /* The Discord companion — a bubble that talks back. */
  "palhelm-bot": `
    <path d="M4.5 7a2.5 2.5 0 0 1 2.5-2.5h10A2.5 2.5 0 0 1 19.5 7v6a2.5 2.5 0 0 1-2.5 2.5h-6L7 19.5v-4Z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />`,

  /* A form, filled — the one thing the other Mac PDF apps won't do. */
  imprimatur: `
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h6.75L19 8.75V19.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5Z" />
    <path d="M13.25 3v4.25a1.5 1.5 0 0 0 1.5 1.5H19" />
    <path d="m8.5 14.5 2.5 2.5 4.5-4.5" />`,

  /* Coup's crown, redrawn: closed body, band held off it. */
  coup: `
    <path d="M4.75 16.5 3.75 5.5l4.6 3.75L12 3.5l3.65 5.75 4.6-3.75-1 11Z" />
    <path d="M5.25 19.75h13.5" />`,

  /* The start page itself: chrome, and the search field under it. */
  startpage: `
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M3.5 8.75h17" />
    <rect x="6.75" y="12.25" width="10.5" height="4" rx="2" />`,

  /* Crop corners — the capture gesture, and ScreenCap's whole identity. */
  screencap: `
    <path d="M3.5 9V5.5a2 2 0 0 1 2-2H9" />
    <path d="M15 3.5h3.5a2 2 0 0 1 2 2V9" />
    <path d="M20.5 15v3.5a2 2 0 0 1-2 2H15" />
    <path d="M9 20.5H5.5a2 2 0 0 1-2-2V15" />`,

  /* Readiness gauge with a pulse across it. */
  vitals: `
    <path d="M6.34 18.16A8 8 0 1 1 17.66 18.16" />
    <path d="M7.5 12.5h2.5l1.5-3 2 6 1.5-3h2.5" />`,

  /* Two carets squared off across a divider. A keycap with two cursors in it
     was the obvious draw and it read as a pause button. */
  typeduel: `
    <path d="M12 4v16" />
    <path d="m5.25 7.75 3.75 4.25-3.75 4.25" />
    <path d="m18.75 7.75-3.75 4.25 3.75 4.25" />`,

  /* Concentric rings — the aim.8tp.dev target. */
  hudaim: `
    <circle cx="12" cy="12" r="8.25" />
    <circle cx="12" cy="12" r="4.25" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />`,

  /* The scan, drawn: one host, the bus, three more found on it. */
  netmap: `
    <path d="M12 7.5v4M5.5 11.5h13M5.5 11.5V14M12 11.5V14M18.5 11.5V14" />
    <circle cx="12" cy="5.25" r="2.25" />
    <circle cx="5.5" cy="16.25" r="2.25" />
    <circle cx="12" cy="16.25" r="2.25" />
    <circle cx="18.5" cy="16.25" r="2.25" />`,

  /* Tide, twice. Shallow, and held well apart — deeper crests silt up into one
     grey band at 22px. */
  tidewatcher: `
    <path d="M3 8.5c1.5-1.75 3-1.75 4.5 0s3 1.75 4.5 0 3-1.75 4.5 0 3 1.75 4.5 0" />
    <path d="M3 15.5c1.5-1.75 3-1.75 4.5 0s3 1.75 4.5 0 3-1.75 4.5 0 3 1.75 4.5 0" />`,

  /* Four meters in the menu bar: CPU, memory, storage, battery. */
  litestats: `
    <path d="M5.5 19v-4M9.75 19v-8.5M14 19v-6M18.25 19v-11.5" />`,

  /* The duplicate glyph — a clipboard's one job. */
  recopy: `
    <rect x="8.5" y="3.5" width="12" height="12" rx="2.5" />
    <rect x="3.5" y="8.5" width="12" height="12" rx="2.5" />`,

  /* A maze wound inward, with the ant that never stops at the centre. */
  antmaze: `
    <path d="M20.5 4.5H4v15h16.5V10H10v5h5.5" />
    <circle cx="13.5" cy="12.5" r="1.35" fill="currentColor" stroke="none" />`,

  /* The bracket as a metro map: two lines, a 45-degree merge, three stations. */
  "wc26-bracket": `
    <path d="M3.5 8.5h4.5l4 4h8.5" />
    <path d="M3.5 16.5h4.5l4-4" />
    <circle cx="3.5" cy="8.5" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="16.5" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="20.5" cy="12.5" r="1.7" fill="currentColor" stroke="none" />`,
};

/** Trimmed inner markup for a slug, or null when a project has no mark yet. */
export const markFor = (slug: string): string | null => marks[slug]?.trim() ?? null;
