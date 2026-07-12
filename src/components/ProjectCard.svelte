<script lang="ts">
  import { formatShortDate, getRepoMetric } from "~/data/github";
  import type { Project } from "~/data/projects";

  interface Props {
    project: Project;
    /** Compact tile for the smaller grid. */
    compact?: boolean;
    /** Full-width hero panel for a spotlight project. */
    spotlight?: boolean;
    /** 1-based card index used for the corner stamp. */
    index?: number;
  }

  let { project, compact = false, spotlight = false, index = 0 }: Props = $props();
  const thumbSrc = $derived(project.thumbnail ?? `/projects/${project.slug}.webp`);
  const metric = $derived(getRepoMetric(project.slug, project.name));
  const stack = $derived(project.stack.filter((tech) => tech.toLowerCase() !== metric?.language?.toLowerCase()));
  const stamp = $derived(String(index).padStart(2, "0"));
  const primaryCta = $derived(project.cta ?? (project.live ? "play" : "open"));
  const projectHref = $derived(project.website ?? project.source);
</script>

{#if spotlight}
  <article class="tile relative grid sm:grid-cols-[1.1fr_1fr] gap-0 border border-border bg-panel">
    <div class="absolute -top-3 left-3 z-10 flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] uppercase">
      <span class="bg-fg text-panel px-2 py-1 border border-border">spotlight</span>
      <span class="bg-panel text-fg px-2 py-1 border border-border">{stamp}</span>
    </div>
    <div class="relative aspect-[16/9] sm:aspect-auto overflow-hidden border-b sm:border-b-0 sm:border-r border-border bg-bg-dark screentone">
      <img
        src={thumbSrc}
        alt="{project.name} preview"
        loading="eager"
        decoding="async"
        class="size-full object-cover grayscale contrast-110"
      />
      <span class="absolute top-2 right-2 bg-fg text-panel px-2 py-1 font-mono text-[10px] uppercase">
        {project.live ? "live" : project.year}
      </span>
    </div>
    <div class="flex flex-col gap-2.5 sm:gap-3 p-3.5 sm:p-5">
      <div>
        <p class="font-mono text-[11px] text-fg-muted uppercase">// spotlight</p>
        <h3 class="font-display text-2xl sm:text-4xl font-black leading-none mt-1">{project.name}</h3>
      </div>
      <p class="text-[13px] sm:text-sm leading-snug sm:leading-relaxed text-fg-dim">{project.description}</p>
      <div class="flex flex-wrap gap-1">
        {#if metric?.language}
          <span class="pill">{metric.language}</span>
        {/if}
        {#each stack as tech}
          <span class="pill">{tech}</span>
        {/each}
      </div>
      <dl class="grid grid-cols-3 gap-3 mt-auto pt-2.5 sm:pt-3 border-t border-border font-mono text-[11px]">
        {#if metric}
          <div>
            <dt class="text-fg-muted">stars</dt>
            <dd class="font-bold text-fg">{metric.stars}</dd>
          </div>
          <div>
            <dt class="text-fg-muted">forks</dt>
            <dd class="font-bold text-fg">{metric.forks}</dd>
          </div>
          <div>
            <dt class="text-fg-muted">updated</dt>
            <dd class="font-bold text-fg">{formatShortDate(metric.updatedAt)}</dd>
          </div>
        {:else}
          <div>
            <dt class="text-fg-muted">year</dt>
            <dd class="font-bold text-fg">{project.year}</dd>
          </div>
        {/if}
      </dl>
      <div class="flex gap-2 font-mono text-xs">
        {#if project.website}
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-center border border-border bg-fg text-panel px-3 py-2 hover:bg-panel hover:text-fg transition-colors"
          >
            {primaryCta} -&gt;
          </a>
        {/if}
        {#if project.source}
          <a
            href={project.source}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-center border border-border bg-panel px-3 py-2 hover:bg-fg hover:text-panel transition-colors"
          >
            github
          </a>
        {/if}
      </div>
    </div>
  </article>
{:else if compact}
  <svelte:element
    this={projectHref ? "a" : "article"}
    href={projectHref}
    target={projectHref ? "_blank" : undefined}
    rel={projectHref ? "noopener noreferrer" : undefined}
    class="tile group relative border border-border bg-panel min-h-[8.5rem] sm:min-h-[10.5rem] flex flex-col {projectHref ? 'hover:border-fg hover:bg-fg hover:text-panel transition-colors' : ''}"
  >
    <span class="absolute top-1 right-1 bg-fg text-panel px-1.5 py-0.5 font-mono text-[9px] uppercase z-10 group-hover:bg-panel group-hover:text-fg">
      {stamp}
    </span>
    <div class="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden border-b border-border bg-bg-dark">
      <img
        src={thumbSrc}
        alt="{project.name} preview"
        loading="lazy"
        decoding="async"
        class="size-full object-cover grayscale contrast-110 transition-transform duration-300 group-hover:scale-[1.04]"
      />
    </div>
    <div class="p-2 sm:p-2.5 flex flex-col gap-1 flex-1">
      <h3 class="font-display text-sm sm:text-base font-black leading-none">{project.name}</h3>
      <p class="line-clamp-2 text-[11px] leading-snug text-fg-dim group-hover:text-panel">{project.description}</p>
      <p class="mt-auto font-mono text-[10px] text-fg-muted group-hover:text-panel">
        {#if metric}
          stars {metric.stars} / updated {formatShortDate(metric.updatedAt)}
        {:else}
          [{project.stack.slice(0, 2).join("] [")}]
        {/if}
      </p>
    </div>
  </svelte:element>
{:else}
  <article class="tile group relative grid grid-cols-[3.25rem_1fr] sm:grid-cols-[5rem_1fr_auto] gap-2.5 sm:gap-3 border border-border bg-panel p-2 sm:p-2.5">
    <span class="absolute top-1 left-1 bg-fg text-panel px-1.5 py-0.5 font-mono text-[9px] uppercase z-10">
      {stamp}
    </span>
    <div class="relative aspect-square overflow-hidden border border-border bg-bg-dark screentone">
      <img
        src={thumbSrc}
        alt="{project.name} preview"
        loading="lazy"
        decoding="async"
        class="size-full object-cover grayscale contrast-110 transition-transform duration-300 group-hover:scale-[1.04]"
      />
    </div>

    <div class="min-w-0 py-0.5">
      <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h3 class="font-display text-base sm:text-lg font-black leading-none">{project.name}</h3>
        <span class="font-mono text-[10px] text-fg-muted">{project.live ? "LIVE" : project.year}</span>
        {#if metric}
          <span class="hidden sm:inline font-mono text-[10px] text-fg-muted">stars {metric.stars}</span>
          <span class="hidden sm:inline font-mono text-[10px] text-fg-muted">forks {metric.forks}</span>
        {/if}
      </div>
      <p class="mt-1 text-[12px] sm:text-[12.5px] leading-snug text-fg-dim line-clamp-2 sm:line-clamp-none max-w-3xl">
        {project.description}
      </p>
      <div class="mt-1.5 hidden sm:flex flex-wrap gap-1">
        {#if metric?.language}
          <span class="pill">{metric.language}</span>
        {/if}
        {#each stack as tech}
          <span class="pill">{tech}</span>
        {/each}
      </div>
      {#if metric}
        <p class="mt-1 hidden sm:block font-mono text-[10px] text-fg-muted">updated {formatShortDate(metric.updatedAt)}</p>
      {/if}
    </div>

    <div class="col-span-2 sm:col-span-1 mt-1 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-end sm:justify-between gap-2 font-mono text-[11px]">
      {#if project.source}
        <a
          href={project.source}
          target="_blank"
          rel="noopener noreferrer"
          class="ink-link hover:bg-fg hover:text-panel px-1 transition-colors"
        >
          github
        </a>
      {/if}
      {#if project.website}
        <a
          href={project.website}
          target="_blank"
          rel="noopener noreferrer"
          class="border border-border px-3 py-1 sm:py-1.5 hover:bg-fg hover:text-panel transition-colors"
        >
          {primaryCta} -&gt;
        </a>
      {/if}
    </div>
  </article>
{/if}
