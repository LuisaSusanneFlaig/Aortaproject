// One timing for every flow view (illustration arrows, pathlines and
// particles, both stories and the reference aorta), so no version runs faster
// or repeats more often than another.

// Length of one round on screen, in real seconds, for every version:
// - arrows: one round of seeds (js/modules/ui/flowArrows.js); a shorter
//   drawing waits at the end, a longer one plays faster as a whole
// - pathlines: one grow + shrink cycle (js/modules/ui/flowLineReveal.js)
// - particles: one release; after the export's 1.4-1.7 simulated seconds the
//   aorta stays empty until the round ends (js/modules/ui/flowvisParticles.js)
export const FLOW_LOOP_SECONDS = 5;

// Playback speed of the 3D views: simulated seconds per real second (0.5 =
// slow motion at half speed).
export const FLOW_SPEED = 0.5;

// The same round in simulated seconds, the unit of the 3D players
// (data-loop-seconds; the viewer's time already runs at FLOW_SPEED).
export const LOOP_SECONDS = FLOW_LOOP_SECONDS * FLOW_SPEED;
