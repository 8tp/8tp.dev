<script>
  /**
   * The project ledger: one row per project, ruled like a printed index, with
   * a cursor-following still on desktop.
   *
   * A row is not one big link any more. The name is the link to the thing
   * itself, and the small out-links on the right (Play, Source, Trailer) each
   * go where they say. That is what lets a row carry more than one action
   * without nesting anchors.
   *
   * One preview element is shared by the whole list and eased toward the
   * pointer each frame, so moving between rows swaps the image while the
   * element keeps gliding. It appears at the cursor on first hover, then
   * follows. Desktop only: this island is mounted with client:media, so touch
   * devices never hydrate it and get a plain list of links.
   *
   * Trailer buttons carry `data-trailer` and are handled by a delegated
   * listener in Trailer.astro, so they work whether or not this island
   * hydrated.
   */
  import Mark from "./Mark.svelte";
  import TechList from "./TechList.svelte";
  import Glyph from "./Glyph.svelte";

  let { entries = [] } = $props();

  let list; // the <ul>, positioning context and coordinate origin
  let peekEl;

  /** Entry currently hovered that has a preview; null fades the still out. */
  let active = $state(null);
  /** Last shown preview, kept through the fade-out so the image persists. */
  let still = $state(null);

  /* Pointer target and eased position, in list coordinates. Written straight
     to the element's style from the frame loop, with no reactive churn. */
  let target = { x: 0, y: 0 };
  let pos = { x: 0, y: 0 };
  let raf = 0;

  const reduced =
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)");

  function frame() {
    const k = reduced && reduced.matches ? 1 : 0.16;
    pos.x += (target.x - pos.x) * k;
    pos.y += (target.y - pos.y) * k;
    if (peekEl) {
      peekEl.style.translate = `${pos.x}px ${pos.y}px`;
      /* Swing a little with sideways speed, like a card held at one corner. */
      const swing = reduced && reduced.matches ? 0 : Math.max(-7, Math.min(7, (target.x - pos.x) * 0.06));
      peekEl.style.rotate = `${swing}deg`;
    }

    const resting = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) < 0.2;
    raf = active || !resting ? requestAnimationFrame(frame) : 0;
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function aim(event) {
    const box = list.getBoundingClientRect();
    target = { x: event.clientX - box.left + 20, y: event.clientY - box.top + 18 };
  }

  /* The site's own dark capture when this page is dark, if there is one. */
  function pick(preview) {
    const dark = document.documentElement.dataset.theme === "dark";
    return dark && preview.srcDark ? { ...preview, src: preview.srcDark } : preview;
  }

  function show(entry) {
    if (!active) pos = { ...target };
    active = entry;
    still = pick(entry.preview);
    wake();
  }

  function enter(event, entry) {
    if (!entry.preview) {
      active = null;
      return;
    }
    aim(event);
    show(entry);
  }

  function move(event) {
    if (!active) return;
    aim(event);
    wake();
  }

  /* Keyboard focus has no pointer: settle the still just under the row. */
  function focusEntry(event, entry) {
    if (!entry.preview) {
      active = null;
      return;
    }
    const item = event.currentTarget.closest("li");
    target = { x: item.offsetLeft + 24, y: item.offsetTop + item.offsetHeight + 8 };
    show(entry);
  }

  function leave() {
    active = null;
  }

  $effect(() => () => cancelAnimationFrame(raf));
</script>

<ul class="ledger" role="list" bind:this={list} onmousemove={move} onmouseleave={leave}>
  {#each entries as entry (entry.slug)}
    <li class="row" class:is-child={entry.child} onmouseenter={(e) => enter(e, entry)}>
      <div class="row-head">
        <span class="mark-box"><Mark d={entry.mark} logo={entry.logo} /></span>

        <!-- A real heading, so the list is navigable by heading. -->
        <h3 class="row-name">
          <a
            class="row-link"
            href={entry.href}
            rel="noopener"
            target="_blank"
            onfocus={(e) => focusEntry(e, entry)}
            onblur={leave}
          >
            {entry.name}
          </a>
        </h3>

        <p class="row-links">
          {#if entry.trailer}
            <button class="link link-muted" type="button" data-trailer={entry.trailer} data-title={entry.name}>
              Trailer
            </button>
          {/if}
          {#each entry.links as link (link.href)}
            <a
              class="link link-muted out"
              href={link.href}
              rel="noopener"
              target="_blank"
              aria-label="{entry.name}: {link.label}"
            >
              {#if link.label === "Source"}<Glyph name="github" />{/if}{link.label}
            </a>
          {/each}
        </p>
      </div>

      <div class="row-body">
        <p class="row-blurb">{entry.blurb}</p>
        <TechList items={entry.stack} />
      </div>
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
  .ledger {
    position: relative;
    list-style: none;
    padding: 0;
    border-bottom: var(--hairline) solid var(--ink-hair);

    /* Everything that has to line up under the name (the blurb) is indented
       by exactly the mark plus its gap. */
    --mark: 1.25rem;
    --mark-gap: 0.65rem;
  }

  .row {
    padding-block: 0.95rem 1.05rem;
    border-top: var(--hairline) solid var(--ink-hair);
  }

  .row:first-child {
    border-top: 0;
    padding-top: 0;
  }

  /* A sub-project sits under its parent with no rule between them, indented
     one mark so it reads as belonging. */
  .row.is-child {
    border-top: 0;
    padding-top: 0;
    padding-left: calc(var(--mark) + var(--mark-gap));
  }

  .row-head {
    display: flex;
    align-items: baseline;
    gap: var(--mark-gap);
  }

  .row-head .mark-box {
    align-self: center;
    transition: color var(--dur-fast) var(--ease);
  }

  .row:hover .mark-box,
  .row:focus-within .mark-box {
    color: var(--ink);
  }

  .row-name {
    min-width: 0;
  }

  .row-link {
    text-decoration: underline;
    text-decoration-color: transparent;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
    transition: text-decoration-color var(--dur-fast) var(--ease);
  }

  .row:hover .row-link,
  .row-link:focus-visible {
    text-decoration-color: var(--ink-line);
  }

  .row-links {
    display: flex;
    gap: 0.9rem;
    margin-left: auto;
    font-size: var(--text-xs);
    white-space: nowrap;
  }

  .row-links button {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: var(--ink-line);
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
  }

  .row-body {
    display: grid;
    gap: 0.55rem;
    margin-top: 0.3rem;
    padding-left: calc(var(--mark) + var(--mark-gap));
  }

  .row-blurb {
    max-width: var(--measure);
    font-size: var(--text-sm);
    color: var(--ink-body);
  }

  /* The shared preview. Inert, absolutely positioned so it never takes a
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
      width: 20rem;
      /* The slot has no width; undo the global img max-width clamp. */
      max-width: none;
      height: auto;
      border-radius: var(--radius-sm);
      border: var(--hairline) solid var(--ink-faint);
      box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.35);
      pointer-events: none;
      /* Hangs from the corner nearest the cursor, so the swing reads as weight. */
      transform-origin: 0 0;
      opacity: 0;
      scale: 0.97;
      /* `translate` is eased by the frame loop, never transitioned. */
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
