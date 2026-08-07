<script>
  /**
   * A project's mark: its real logo where one exists, the drawn glyph where it
   * doesn't.
   *
   * Five projects have no owned mark anywhere — Palhelm Bot, ScreenCap, netmap,
   * LiteStats and Recopy — so those still render the line drawing from
   * src/data/marks.ts. See scripts/fetch-logos.mjs for what was searched.
   *
   * Themed logos ship as a light/dark pair (the source carried a
   * prefers-color-scheme rule, which an <img> would otherwise resolve against
   * the OS rather than this site's toggle). Both are rendered and CSS picks one
   * off [data-theme], so switching theme never waits on a network request.
   *
   * `{@html}` is safe here: the glyph payload is a static constant in this repo,
   * never anything a visitor supplies.
   */
  let { d = "", logo = null, name = "" } = $props();

  const themed = logo && "light" in logo;
</script>

{#if logo}
  {#if themed}
    <img class="logo logo-light" src={logo.light} alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <img class="logo logo-dark" src={logo.dark} alt="" aria-hidden="true" loading="lazy" decoding="async" />
  {:else}
    <img class="logo" src={logo.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
  {/if}
{:else if d}
  <svg
    class="mark"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {@html d}
  </svg>
{/if}

<style>
  .mark,
  .logo {
    width: 100%;
    height: 100%;
  }

  .logo {
    /* App icons arrive as square tiles and bare glyphs alike; contain keeps
       both honest instead of cropping the tiles. */
    object-fit: contain;
    /* Tiled icons read as icons; transparent glyphs are unaffected. */
    border-radius: 22%;
  }

  /* The head script always stamps a concrete theme before first paint, so one
     of these is always the live one — there is no unset state to cover. */
  :global(html[data-theme="dark"]) .logo-light,
  :global(html[data-theme="light"]) .logo-dark {
    display: none;
  }
</style>
