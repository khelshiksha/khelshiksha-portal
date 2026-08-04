import { randRange } from "./iso";

/**
 * The sky above KhelVerse: a few clouds and one flock of birds.
 *
 * THIS IS THE SECOND ATTEMPT. The first version of the hero had drifting
 * clouds, a hot-air balloon and birds, and all of it was deleted for two
 * reasons worth restating so they are not reintroduced:
 *
 *   1. THE BUG. The world used to be pulled up BEHIND the copy on desktop, so
 *      a cloud would drift across the middle of the paragraph and read as a
 *      rendering artifact next to the words "NCF 2023". That layout is gone —
 *      the campus now sits in its own band between the trust signals and the
 *      prose — so nothing in this file can pass under text. If the hero is
 *      ever re-stacked so the world overlaps copy again, this goes first.
 *
 *   2. THE NOISE. A balloon, birds, clouds, swaying trees, a turning windmill
 *      and a hopping die is six ambient loops competing for one pair of eyes,
 *      and the scene is meant to read as calm. So this is deliberately
 *      thin: four clouds that barely move, and one flock that crosses the sky
 *      about twice a minute. It should register as weather, not as animation.
 *
 * WHERE THINGS MAY SIT. The camera crop is 1096x444 starting at (96, 104),
 * and the island's highest point is y≈188 — so the usable sky is the band
 * between y 110 and y 180. Below lg the frame crops to the middle 620 units
 * of that, i.e. viewBox x 334 to 954. ANYTHING OUTSIDE THAT RANGE IS INVISIBLE
 * ON A PHONE, where most of the traffic is, so the two clouds that matter and
 * the flock's path all live inside it; the outer two clouds are a desktop
 * bonus that widens the sky rather than content anyone can miss.
 *
 * Motion is transform and opacity only — no layout, no paint — and every
 * duration comes from the seeded generator in iso.ts rather than being shared,
 * because a single duration across four clouds is exactly what makes an
 * animated illustration read as a screensaver. Reduced motion stops all of it
 * (globals.css); the sky is still a sky when it holds still.
 */

type CloudSpec = {
  /** viewBox coordinates, not grid units — the sky has no ground position. */
  x: number;
  y: number;
  scale: number;
  /** How far it drifts, in local units. Smaller clouds drift less: parallax. */
  drift: number;
  seed: number;
};

const CLOUDS: readonly CloudSpec[] = [
  /* The two inside the phone crop (x 334–954). */
  { x: 452, y: 138, scale: 1, drift: 34, seed: 71 },
  { x: 786, y: 122, scale: 0.74, drift: 22, seed: 83 },
  /* Widen the sky on laptops. */
  { x: 214, y: 152, scale: 0.62, drift: 18, seed: 97 },
  { x: 1046, y: 144, scale: 0.82, drift: 27, seed: 109 },
];

/**
 * One cloud: three overlapping ellipses in a single fill.
 *
 * Flat shapes with no gradient and no stroke, because every solid in this
 * world is flat-shaded and a soft airbrushed cloud would be the only thing in
 * the scene lit by a different renderer. Overlapping same-fill ellipses merge
 * seamlessly, so the silhouette reads as one form.
 *
 * Placement is an SVG `transform` attribute on the outer <g> and the drift is
 * a CSS transform on the inner one. They MUST stay on separate elements: a CSS
 * transform replaces the attribute outright rather than composing with it, so
 * animating the placed group would teleport the cloud to the origin.
 */
function Cloud({ x, y, scale, drift, seed }: CloudSpec) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g
        className="kv-cloud"
        style={
          {
            "--kv-drift": `${drift}px`,
            animationDuration: `${randRange(seed, 26, 44)}s`,
            animationDelay: `-${randRange(seed + 1, 0, 20)}s`,
          } as React.CSSProperties
        }
      >
        <g fill="var(--w-cloud)" opacity="0.92">
          <ellipse cx="0" cy="0" rx="36" ry="17" />
          <ellipse cx="-27" cy="6" rx="24" ry="12" />
          <ellipse cx="29" cy="7" rx="26" ry="13" />
        </g>
      </g>
    </g>
  );
}

/** Wing positions, as two ends of one stroke. Flapping is a scaleY on this. */
function Bird({
  x,
  y,
  scale,
  seed,
}: {
  x: number;
  y: number;
  scale: number;
  seed: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        className="kv-wing"
        d="M -9 0 Q -4.5 -6 0 -0.6 Q 4.5 -6 9 0"
        fill="none"
        stroke="var(--w-bird)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animationDuration: `${randRange(seed, 0.62, 0.94)}s`,
          animationDelay: `-${randRange(seed + 1, 0, 0.8)}s`,
        }}
      />
    </g>
  );
}

/**
 * Three birds in loose formation, crossing the sky once every ~40s.
 *
 * They fade in and out at the ends of the run rather than looping hard,
 * because a linear infinite translate snaps back to the start and a bird that
 * teleports is the single most obvious tell that a scene is a loop.
 */
function Flock() {
  return (
    <g
      className="kv-flock"
      style={{ animationDuration: "42s" } as React.CSSProperties}
    >
      {/* Scale 1.6 and up, not 1. At true size a bird was eighteen user units
          across — about twelve screen pixels on a laptop — which is a grey
          squiggle, not a bird. Big enough to be a silhouette, small enough to
          stay behind the die and the buildings in the eye's ranking. */}
      <Bird x={300} y={172} scale={1.7} seed={11} />
      <Bird x={252} y={186} scale={1.35} seed={23} />
      <Bird x={268} y={156} scale={1.15} seed={37} />
    </g>
  );
}

export function Sky() {
  return (
    <g>
      {CLOUDS.map((cloud) => (
        <Cloud key={cloud.x} {...cloud} />
      ))}
      <Flock />
    </g>
  );
}
