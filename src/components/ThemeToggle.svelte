<script>
  /**
   * The eclipse, ported from aeperion.com: a hairline circle with one half
   * filled, which rotates 180° so the fill swaps sides on theme change.
   *
   * `--ease-in-out` is symmetric and is used here and nowhere else — a
   * reversible state is the one case where the return leg should read as the
   * exact undo of the outbound one rather than as its equal.
   *
   * Hidden with `visibility` until hydrated, not `display`: the box stays
   * reserved so the header cannot shift when JS lands, and there is never a
   * dead control on the page for anyone browsing without it.
   */
  let theme = $state("light");
  let ready = $state(false);

  $effect(() => {
    const root = document.documentElement;
    theme = root.dataset.theme === "dark" ? "dark" : "light";
    ready = true;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event) => {
      if (localStorage.getItem("theme")) return;
      theme = event.matches ? "dark" : "light";
      apply(theme);
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  });

  function apply(next) {
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]:not([media])')
      ?.setAttribute("content", next === "dark" ? "#101411" : "#f6f6f3");
  }

  function toggle() {
    theme = theme === "dark" ? "light" : "dark";
    apply(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Private mode: the choice just does not persist.
    }
  }
</script>

<button
  class="theme-toggle"
  type="button"
  onclick={toggle}
  style:visibility={ready ? "visible" : "hidden"}
  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
>
  <span class="theme-toggle__dot" aria-hidden="true"></span>
</button>

<style>
  .theme-toggle {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: 2rem;
    block-size: 2rem;
    color: var(--ink-soft);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--dur-fast) var(--ease);
  }

  /* 32px of ink, 44px of target. */
  .theme-toggle::after {
    content: "";
    position: absolute;
    inset: -6px;
  }

  .theme-toggle:hover,
  .theme-toggle:focus-visible {
    color: var(--ink);
  }

  .theme-toggle:active {
    transform: scale(0.88);
  }

  .theme-toggle__dot {
    inline-size: 0.875rem;
    block-size: 0.875rem;
    border: var(--hairline) solid currentColor;
    border-radius: 50%;
    background: linear-gradient(90deg, currentColor 0 50%, transparent 50% 100%);
    transition: transform var(--dur) var(--ease-in-out);
  }

  :global(html[data-theme="dark"]) .theme-toggle__dot {
    transform: rotate(180deg);
  }
</style>
