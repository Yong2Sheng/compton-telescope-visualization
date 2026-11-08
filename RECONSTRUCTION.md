# Photon → event reconstruction → CDS

Open `reconstruction.html` directly in a modern browser. It is self-contained and works offline, including Three.js and HEALPix boundaries. It requires WebGL. It does not load remote scripts or fonts. Reference links only open when clicked.

## Presentation

The initial language is Chinese unless English was previously selected. The language button translates controls, event-card text, steps, explanations and projection names. The default compact presentation layout enlarges text and reserves the same top/bottom positions for the two canvases. The header toggles the expanded layout, and offers fullscreen.

Expand **Energy & true-source settings** to change incident energy (10–10000 keV), χ₀ (0–180°) and ψ₀ (0–360°). Apply settings before starting the next photon. Past committed events are never rewritten. Applying settings discards a not-yet-committed demonstration event and returns the stepper to Ready. Source groups are retained and can be selected again. The other-source checkbox overlays their original directions in purple in the current display frame.

Use **Next step** for incident photon, first scatter, full absorption, reconstructed cone, event card and CDS entry. The event card and moving gold token keep the identity of the event visible. The card lists propagation-direction coordinates χₖ, ψₖ; its lower section explicitly lists the back-projection coordinates χₐ, ψₐ used by CDS. Replay uses the same event without adding it twice. Auto runs successive complete events; pause lets the current short transition finish and stops advancing.

**Add 1,000 events** uses the same generator as the stepper and adds to existing history. It operates in small chunks so camera controls remain available. Its button can stop the batch; already generated events remain. A pending demonstration event stays pending and is not silently counted as an extra batch event. Clear removes all committed events and the pending demonstration event. The history slider reopens a committed event in both views. The theoretical green source-response guides are optional, initially hidden, so the cone emerges from actual accumulated events.

Both scenes support independent orbit, pan, zoom, reset, and free flight. Free flight uses drag-look plus W/A/S/D, Q/E for height, Shift for speed. Click or focus the desired view first. The interaction legends for r₁ (white), r₂ (cyan), and a = −k are static outside the scene. The detector box has side length 3.8 display units; the two interactions are separated by 1.25–1.6 display units to improve visibility. This is an illustrative layout, not a physical detector dimension. The local XYZ origin, first-hit marker, incident-ray endpoint and cone apex all coincide at r₁. The detector remains in its own fixed frame; the local axes translate to each new event without rotating. The white first-hit marker appears immediately on the first Next click and persists through all later stages. Axis labels follow the translated arrow endpoints as transparent DOM annotations, with no canvas-text tiles. Formulae, Greek letters and subscripts use locally bundled KaTeX and embedded fonts, with no network font dependency. The original `event-cone-rotation.html` retains manual ϕ and β controls and persistent axis tracks; it remains a separate geometry demonstration. Both projection modes are part of this full demonstration; the intermediate preview page has been removed.

## Physics and reconstruction

The source is a far-field unit direction S. Incident propagation is −S. A sampled event has first-scatter angle ϕ and azimuth β. The existing `physics.js` provides the stable source frame, vector/angle conversions, and event-cone geometry shared with the original page.

For a free electron initially at rest:

- q = E′ / E = 1 / [1 + (E / 510.99895 keV)(1 − cosϕ)].
- Nonpolarized Klein–Nishina differential weight in μ = cosϕ: q²[q + 1/q − (1 − μ²)].
- Generate μ uniformly on [−1,1] and accept against envelope 2. This samples per solid angle correctly, including the sinϕ Jacobian; β is uniform on [0,2π).
- First energy deposit E₁ = E − E′; second deposit E₂ = E′, assuming full absorption.
- Reconstruct k = normalize(r₂ − r₁), a = −k, and ϕ = acos[1 − mₑc²(1/E₂ − 1/(E₁ + E₂))].
- Candidate source directions satisfy s·a = cosϕ. The event cone is built from these physical directions at r₁, including obtuse ϕ.

First interactions vary between events. Second interactions are placed along k inside the detector box. Distances and flight timing illustrate a fully contained two-site event; they do not model attenuation, mean free paths, material composition, efficiency, Doppler broadening or measurement errors. A star shows the source direction, not a finite-distance source that would send nonparallel rays through the detector.

`unpolarizedModel.sample({energy,rng,source,basis,polarization})` is the explicit sampling-model interface. A future polarized model can supply correlated ϕ and β using that frame; polarization is not enabled in this version.

## Projection and HEALPix

The display frame rotates S to the map center. All event directions and HEALPix indices remain physical-frame quantities. HEALPix NSIDE = 8 uses 768 equal-area spherical pixels and RING ordering. `healpixRingIndex` is checked against all 1000 existing healpy-generated reference indices; pixel outlines come from the existing healpy-generated dataset.

- **Source-centered azimuthal equidistant**: ρ = acos(S·a), β is the azimuth about S; x = ρ cosβ, y = ρ sinβ, z = ϕ, in radians with equal axis scales. Ideal events from the centered source satisfy x²+y²=z². The exact antipode ρ=π has no unique azimuth and is not assigned an invented coordinate.
- **Source-centered Mollweide equal-area**: project the same directions through Mollweide and use z=ϕ. Its shape can distort and split at the longitude seam. Boundary polygons are clipped and curves split at that seam.

The slice is a ±10° bin around the selected ϕ, using current-source events. Standard mode shows its HEALPix counts as disks at representative directions inside pixels; Mollweide mode displays actual projected pixel polygons. Disks/pixels are placed at the bin-center height; event points retain their exact ϕ. Their purpose is to distinguish a binned count map from the exact event point cloud.

## Build and checks

- `npm run build:reconstruction`: regenerate the single-file full demonstration.
- `npm run build:all`: regenerate both finished pages.
- `npm run test:reconstruction`: 100000 generated events over four energies, energy/direction/angle reconstruction, probability moments against numerical integration, HEALPix reference matches, source poles and projection singularities.
- `npm run test:reconstruction-browser`: actual UI flow, replay, +1000 events, changes to energy and source without rewriting history, projection switch, independent free flight, pause, bilingual display, aligned canvases at 1600 and 1366 widths, narrow-screen overflow and offline loading. Requires Google Chrome.
- Existing `npm test` and `npm run test:psi` validate the shared original geometry.

Screenshots and acceptance outputs are stored under `output/reconstruction/`.

## Future improvements

Planned future work includes the source-frame inclined-plane view, fixed-reference source motion, resolution/ARM, polarization and presentation improvements. These are future tasks, not enabled features.

## References

- Kierans, Takahashi & Kanbach, *Compton Telescopes for Gamma-ray Astrophysics*, §5.1, Figures 18–19: https://arxiv.org/html/2208.07819#S5.SS1
- Geant4 Physics Reference Manual, *Compton scattering*: https://geant4.web.cern.ch/documentation/dev/prm_html/PhysicsReferenceManual/electromagnetic/gamma_incident/compton/compton.html
