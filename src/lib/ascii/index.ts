/**
 * ASCII scenes by name, for `site.backdrop` and `?bg=`. Each is a colour
 * piece drawn by src/lib/ascii/engine.ts.
 *
 *   koi        a koi pond with lily pads, ripples and caustics; tap to feed
 *   meadow     grass in gusts, clouds, pollen, and a bunny chaining hops
 *   starlings  a murmuration at dusk; the cursor is a hawk
 *   jellyfish  a bloom of four species over glowing plankton; tap for a flash
 *   warren     rabbits, burrows and a hunting hawk; they escape by bunnyhopping
 */
import type { Scene } from "./engine";
import { koi } from "./koi";
import { meadow } from "./meadow";
import { starlings } from "./starlings";
import { jellyfish } from "./jellyfish";
import { warren } from "./warren";

export const scenes: Record<string, Scene> = { jellyfish, warren, koi, meadow, starlings };
