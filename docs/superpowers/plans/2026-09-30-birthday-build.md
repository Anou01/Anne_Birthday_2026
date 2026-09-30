# Birthday scene and experience implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver the birthday website using the user's cake, letter, Bless.txt,
and photographs, with an original attractive table and a complete local flow.

**Architecture:** Static HTML/CSS with native JS modules. A Three.js scene owns
model loading, the table, lighting and cake reveal; DOM scenes own copy and
accessible controls. Vite builds a self-contained static distribution.

**Tech Stack:** Three.js 0.186.1, Vite 8.3.1, native Web Audio, Python/Pillow for
derived photo copies, Playwright for browser verification.

**Spec:** `docs/superpowers/specs/2026-09-30-birthday-surprise-design.md`

## Execution ruling
The user explicitly said to use Bless.txt and the supplied models and to go
ahead and make the table beautiful. Implement inline using the already discussed
direction; further confirmation of the same choice would repeat settled scope.
No Git repository exists, so retain local files and a ledger without commits.

## Constraints and review focus
- Preserve all source assets and exact letter text, use derived files in public/assets.
- No external public deployment. Keep model texture requests local.
- Repeated Enter/click must not duplicate transitions; replay resets everything.
- Denied microphone must retain the button fallback and release tracks.
- Mobile scene framing and long Lao text must not overflow horizontally.
- WebGL/model failures need a visible recovery path.
- Reduced motion must retain all content and interaction.

## Task 1 — asset preparation and project setup
- [ ] Create package.json, Vite setup and scripts/prepare_assets.py.
- [ ] Extract only known cake entries into public/assets/models; copy letter FBX
  and textures, copy exact letter/name text, resize photographs to WebP.
- [ ] Inspect mesh bounds with loaders and review photo contact sheet.

## Task 2 — real scene and original table
- [ ] Create src/scene.js (scene lifecycle/model transforms/candle/reveal),
  src/table.js (lathed walnut table, linen mat and brass details), src/materials.js.
- [ ] Use OBJLoader and FBXLoader, normalize scale, manually remap local textures.
- [ ] Render one candle; implement camera framing for desktop and narrow phones.
- [ ] Verify both supplied models are present and visible in browser screenshots.

## Task 3 — complete personal flow
- [ ] Write behavior tests for legal transition order and repeated input before
  src/flow.js implementation. Run RED then GREEN using node --test.
- [ ] Create index.html, src/main.js, src/styles.css, src/audio.js and
  src/microphone.js. Welcome → terminal → cake → reveal, original Lao letter
  dialog, three initial pictures and the remaining gallery, mute and replay.
- [ ] Include accessible fallback/retry, focus handling and reduced motion.

## Task 4 — verification and handoff
- [ ] Run production build and browser checks for full desktop/mobile journeys,
  source letter equality, models loaded, no console errors, fallback and replay.
- [ ] Inspect desktop/mobile screenshots together, fix observed defects, confirm.
- [ ] Run Impeccable detector once and request an independent final review.
- [ ] Write README, update CURRENT_TASK with exact checks and remaining limitations.

## Ledger
- Plan created. Implementation authorized by latest user instruction; table styling
  delegated. No promise of already-tested microphone or model splitting.
