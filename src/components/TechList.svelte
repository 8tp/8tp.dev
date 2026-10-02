<script>
  /**
   * A project's stack: each name with its logo in front, in brand colour where
   * that reads on both papers. Rendered without hydration from Astro and from
   * inside the ledger island alike, so it is markup only.
   */
  let { items = [] } = $props();
</script>

{#if items.length}
  <ul class="tech" aria-label="Built with">
    {#each items as item (item.name)}
      <li class="tech-item">
        {#if item.id}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style:color={item.color}>
            <use href="#{item.id}" />
          </svg>
        {/if}
        {item.name}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 1rem;
    list-style: none;
    padding: 0;
    font-size: var(--text-xs);
    color: var(--ink-muted);
  }

  .tech-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    white-space: nowrap;
  }

  svg {
    width: 0.85rem;
    height: 0.85rem;
    flex: none;
    color: var(--ink);
  }
</style>
