<script>
  /**
   * A small interface glyph that sits in front of a link label: the GitHub
   * mark or the mail envelope, drawn from the page sprite (Sprite.astro).
   * Decorative, since the label says the same thing.
   */
  let { name } = $props();
</script>

<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <use href="#g-{name}" />
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
