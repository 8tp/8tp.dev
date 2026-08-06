# Grainwave / Konvert-mode image prompts

Style named after Hewar’s public “Grainwave” explorations. Use for hero art, then **post-process** film grain / half-tone yourself.

## Master style block (append to subjects)

```
heavy film grain, coarse half-tone dither, risograph print texture,
high-contrast graphic illustration, limited flat saturated palette,
electric cobalt blue, viridian green, terracotta orange accents,
cinematic negative space, editorial poster composition,
screen-print ink-on-paper feel, NOT photoreal, NOT 3d render,
NOT glassmorphism, NOT purple gradient --stylize mid --ar 16:9
```

## Hero subjects (swap product metaphor)

**Infrastructure / monitoring**
```
lonely white cabin on vast green hills under electric cobalt sky,
metaphor for reliability and uptime, sparse horizon, [MASTER STYLE]
```

**AI / agents**
```
solitary figure under a massive geometric planet or atlas sphere,
mythic scale, blue-orange duotone option, [MASTER STYLE]
```

**Security / compliance**
```
monumental abstract seal or shield as landscape architecture,
half-tone pattern as material, high contrast, [MASTER STYLE]
```

**Creative tool**
```
vast atelier space with one glowing object of focus,
graphic shapes, hard light, [MASTER STYLE]
```

## Composition rules for landing use

1. Leave **negative space** for headline (usually left third or lower third)
2. Avoid busy faces / unreadable micro-detail
3. Generate **4–12** in a series; pick 3; finish in PS
4. Export WebP; apply site-wide grain overlay CSS for consistency

## Midjourney hygiene

- Lock style with `--sref` from your best frame once you have a winner
- Name the series (internal brand code) so the team reuses it
- Do not ship raw gens with watermarks / bad hands if any figurative elements

## After generation checklist

- [ ] Crop for 16:9 / 21:9 hero
- [ ] Add grain + half-tone if gen is too clean
- [ ] Color-match to design.md accent
- [ ] Place UI chrome: logo, headline, one CTA — nothing else
