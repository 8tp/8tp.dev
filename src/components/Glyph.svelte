<script>
  /**
   * A small interface glyph that sits in front of a link label: the GitHub
   * mark or the mail envelope. Decorative, since the label says the same thing.
   */
  import { glyphs } from "~/data/stack";

  let { name } = $props();
  const stroked = name === "mail";
</script>

<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  {#if stroked}
    <path d={glyphs[name]} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
  {:else}
    <path d={glyphs[name]} fill="currentColor" />
  {/if}
</svg>

<style>
  .glyph {
    display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: -0.14em;
    margin-right: 0.3em;
    flex: none;
  }
</style>
