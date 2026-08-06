<script>
  /**
   * A list of work entries with a cursor-following hover preview.
   *
   * Modelled on omarabdulrahim.com: the entry itself is the link, hovering
   * washes the whole block (padding + equal negative margin, so nothing
   * shifts), and a small still glides after the cursor.
   *
   * One preview element is shared by the whole list and eased toward the
   * pointer each frame, so moving between entries swaps the image while the
   * element keeps gliding — no per-entry teleport, no re-fade. It appears at
   * the cursor on first hover, then follows.
   *
   * Desktop only — this island is mounted with client:media, so touch devices
   * never hydrate it and the markup they get is a plain list of links.
   */
  let { entries = [], split = false } = $props();

  let list; // the <ul>, positioning context and coordinate origin
  let peekEl;

  /** Entry currently hovered that has a preview; null fades the still out. */
  let active = $state(null);
  /** Last shown preview — kept through the fade-out so the image persists. */
  let still = $state(null);

  /* Pointer target and eased position, in list coordinates. Written straight
     to the element's style from the frame loop — no reactive churn at 60 Hz. */
  let target = { x: 0, y: 0 };
  let pos = { x: 0, y: 0 };
  let raf = 0;

  const reduced =
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)");

  function frame() {
    /* Ease toward the cursor; snap when the visitor prefers reduced motion. */
    const k = reduced && reduced.matches ? 1 : 0.16;
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    if (peekEl) peekEl.style.translate = `${pos.x}px ${pos.y}px`;

    const resting = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) < 0.5;
    raf = active || !resting ? requestAnimationFrame(frame) : 0;
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function aim(event) {
    const box = list.getBoundingClientRect();
    target = { x: event.clientX - box.left + 20, y: event.clientY - box.top + 18 };
  }

  function enter(event, entry) {
    if (!entry.preview) {
      active = null;
      return;
    }
    aim(event);
    /* First appearance materialises at the cursor; afterwards it glides. */
    if (!active) pos = { ...target };
    active = entry;
    still = entry.preview;
    wake();
  }

  function move(event) {
    if (!active) return;
    aim(event);
    wake();
  }

  /* Keyboard focus has no pointer — settle the still just under the entry. */
  function focusEntry(event, entry) {
    if (!entry.preview) {
      active = null;
      return;
    }
    const item = event.currentTarget.closest("li");
    target = { x: item.offsetLeft + 16, y: item.offsetTop + item.offsetHeight + 8 };
    if (!active) pos = { ...target };
    active = entry;
    still = entry.preview;
    wake();
  }

  function leave() {
    active = null;
  }

  $effect(() => () => cancelAnimationFrame(raf));
</script>

<ul
  class="entries"
  class:entries-split={split}
  role="list"
  bind:this={list}
  onmousemove={move}
  onmouseleave={leave}
>
  {#each entries as entry (entry.slug)}
    <li class="entry-wrap" onmouseenter={(e) => enter(e, entry)}>
      <a
        class="entry"
        href={entry.href}
        rel="noopener"
        target="_blank"
        onfocus={(e) => focusEntry(e, entry)}
        onblur={leave}
      >
        <!-- A real heading inside the link, so the list is navigable by
             heading. `<a>` is transparent content, so this is valid. -->
        <h3 class="entry-name">{entry.name}</h3>
        <span class="entry-body muted">{entry.blurb}</span>
      </a>

      {#if entry.stack?.length || entry.sourceHref}
        <p class="entry-foot">
          {#if entry.stack?.length}
            <span class="stack">{entry.stack.join(" · ")}</span>
          {/if}
          {#if entry.sourceHref}
            <a
              class="link link-muted entry-src"
              href={entry.sourceHref}
              rel="noopener"
              target="_blank"
              aria-label="{entry.name} source"
            >
              source
            </a>
          {/if}
        </p>
      {/if}
    </li>
  {/each}

  {#if still}
    <li class="peek-slot" aria-hidden="true">
      <img
        class="peek"
        class:is-shown={active !== null}
        bind:this={peekEl}
        src={still.src}
        alt=""
        width={still.width}
        height={still.height}
        decoding="async"
        fetchpriority="low"
      />
    </li>
  {/if}
</ul>

<style>
  .entries {
    position: relative;
  }

  .entry-wrap {
    padding: 0.5rem 0.75rem;
    margin: 0 -0.75rem;
    border-radius: var(--radius);
    transition: background-color var(--dur-fast) var(--ease);
  }

  .entry-wrap:hover,
  .entry-wrap:focus-within {
    background: var(--ink-wash);
  }

  .entry {
    display: block;
  }

  .entry-body {
    display: block;
    max-width: var(--measure);
  }

  .entry-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.15rem 0.75rem;
    margin-top: 0.15rem;
  }

  .stack {
    color: var(--ink-soft);
    font-size: var(--text-xs);
  }

  .entry-src {
    font-size: var(--text-xs);
  }

  /* The shared preview. Inert, absolutely positioned so it never takes a grid
     row, and only ever on a fine pointer. */
  .peek-slot {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .peek {
    display: none;
  }

  @media (min-width: 52rem) and (hover: hover) and (pointer: fine) {
    .peek {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 20;
      width: 19rem;
      /* The slot has no width — undo the global img max-width clamp. */
      max-width: none;
      height: auto;
      border-radius: var(--radius);
      border: var(--hairline) solid var(--ink-faint);
      pointer-events: none;
      opacity: 0;
      scale: 0.97;
      /* `translate` is eased by the frame loop, never transitioned — only the
         reveal itself animates here. */
      transition: opacity 250ms var(--ease), scale 250ms var(--ease);
    }

    .peek.is-shown {
      opacity: 1;
      scale: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .peek {
      transition: none;
    }
  }
</style>
