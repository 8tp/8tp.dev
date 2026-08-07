<script>
  /**
   * The <svg> shell every project mark is drawn into.
   *
   * Marks ship as inner markup only (src/data/marks.ts) so the viewBox, stroke
   * weight and joins live in exactly one place. `currentColor` means the mark
   * inherits whatever ink level the entry is at, in either theme, with no
   * second asset and no second request.
   *
   * `{@html}` is safe here: the payload is a static, authored constant in this
   * repo, never anything a visitor supplies.
   */
  let { d = "" } = $props();
</script>

{#if d}
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
  .mark {
    width: 100%;
    height: 100%;
  }
</style>
