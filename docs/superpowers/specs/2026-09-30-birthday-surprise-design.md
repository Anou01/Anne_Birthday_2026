# Birthday surprise — design

## Intent and agreed direction

A small, romantic birthday website for the user's girlfriend, celebrating
30 September 2026. The experience progresses from a quiet welcome through a
short terminal message to a dimensional pink-and-white birthday cake. Blowing
out its single candle opens the cake and reveals photographs.

The user selected a dimensional cake with soft lighting over an illustrated
cartoon style, and subsequently supplied cake and letter models to use. The
visual direction is warm, intimate, and restrained. Use these supplied models
instead of constructing a substitute cake from CSS.

## Experience

### 1. Welcome

- Full-screen cream and blush composition with generous space.
- Exact heading: “This is a special day”. Date: “30.9.2026”.
- One prominent Enter button. Physical Enter also advances.
- This first interaction enables browser audio. A persistent, accessible sound
  toggle lets the visitor mute sound throughout the experience.
- Fade gradually into darkness over approximately one second.

### 2. Terminal

Warm off-white monospace text on a nearly black background, with a subtle blush
accent and blinking cursor. Characters appear with quiet synthesized keyboard
clicks. Vary typing timing slightly and pause between lines. Target roughly
20–25 seconds for the entire sequence, with a longer pause before the birthday
greeting. Pressing Enter while typing completes the text; a subsequent Enter
opens the cake scene. A visible button provides the same controls on mobile.

Use the user's wording, with the fixed celebration date inserted in the date
line. This experience does not depend on the viewer's current device date.

```text
> booting surprise.exe
> loading memories...
> loading special moments...
> checking today's date...
> Today is 30.9.2026
> the birthday of someone very special.
> someone kind.
> someone cute.
> someone who makes my world softer.
> Happy Birthday, my love.
> press enter to continue...
```

Keep the newest line visible on short screens. Expose the complete message to
assistive technology without announcing every character.

### 3. Candle and cake

- A softly lit table in a dark, warm room, with a centered cake on a plate.
- Use the supplied pink cake model and its texture, with soft shadows and
  restrained highlights in a browser 3D scene. Preserve the model's decorative
  character rather than promising photorealistic rendering.
- Add an original round table in warm, medium-brown wood with a matte finish,
  rounded rim, and simple pedestal. A small ivory fabric mat sits under the
  cake. Keep its silhouette and material detail quiet so the cake stays central.
  Use amber candlelight and soft blush ambient lighting against a dark brown
  background. Position the supplied paper-and-ink model beside the cake.
- One striped candle with a gently swaying flame, glowing halo, and subtly
  changing illumination on the cake and tabletop.
- Short invitation to make a wish; keep interface controls secondary.
- An explicit “เปิดไมค์เพื่อเป่าเทียน” control requests microphone access only
  after a user gesture. Briefly measure ambient level, then look for a sustained
  rise in sound energy. This detects blowing-like sound levels, not speech or
  reliable identification of breath.
- A visible “เป่าเทียน” button always performs the same action without a mic.
- If microphone permission is denied, unavailable, or the page lacks a secure
  context, show a brief explanation beside the fallback button. The flow remains
  usable. Stop microphone tracks immediately after detection or leaving the
  scene. Audio is processed locally and is neither recorded nor uploaded.

### 4. Surprise reveal

- Fade the flame out, show a brief wisp of smoke, and pause for the wish.
- Fade away the extinguished candle before the cake's two halves ease apart.
- Three polaroid-style photo cards rise from the center in a staggered sequence
  and settle in a gently fanned arrangement above the cake.
- Warm ambient light increases so the photographs remain visible after the
  candle is extinguished. Show “Happy Birthday, my love.” with a few subtle
  floating hearts. Avoid dense particle effects.
- On narrow screens, arrange the cards vertically after the reveal and allow
  scrolling so all photographs and captions can be read.
- Provide “ดูอีกครั้ง” to reset the experience and clean up active animations,
  audio timers, and microphone state.
- After the photographs appear, make the letter available to open as a readable
  panel containing the original Lao text from `Bless.txt`. Keep the text as HTML
  with Lao-capable fonts rather than squeezing it into a small model texture.

## Content and assumptions

The user has now supplied `Name.txt` (Ani / ອານິ), `Bless.txt` (the personal
message in Lao), and 13 photos, including 12 in `photo/Couple`. Preserve the
original files and the wording of the message. Use three couple photographs
for the initial reveal and make the other supplied photographs available in the
following gallery. Choose the initial three after visually reviewing them; no
photo selection has been made by the file inventory. A small content
configuration defines paths, alt text, and any captions. Do not invent personal
events or captions. Produce appropriately sized web copies of the large photos.

The opening cake is interpreted as two halves separating to reveal pictures
hidden inside. This is a magical presentation rather than a realistic cutting
simulation. No background music is needed; keyboard audio is sufficient.

## Technical structure

A static site using HTML, CSS, native JavaScript modules, and Three.js for the
supplied 3D assets and original table. It requires no backend, login, database,
analytics, paid service, or UI framework. Pin the rendering dependency during
implementation and keep the rest of the experience independent of WebGL.

- `index.html`: semantic scene structure, controls, accessible status text.
- `styles.css`: responsive layout, text presentation, controls, transitions.
- `src/scene.js`: models, original table geometry, camera, lighting, candle,
  cake reveal, resizing, and graphics resource cleanup.
- `src/main.js`: explicit welcome → terminal → cake → reveal state transitions,
  input handling, replay, and cleanup.
- `src/content.js`: celebration copy and configurable photographs.
- `src/audio.js`: gesture-enabled keyboard sound and mute state.
- `src/microphone.js`: optional permission, level detection, and track cleanup.
- `assets/`: web-ready copies of supplied models, textures, and photographs.
- `README.md`: local serving and personal-photo replacement instructions.

Only the active scene accepts input. Guard repeated clicks during transitions.
Move focus to the incoming scene's heading or primary control. Use buttons with
visible focus and comfortable touch targets. Reduced-motion mode removes flame
flicker, typing delays, and moving reveals while preserving every scene and its
controls. Avoid repeated animation loops when the page is hidden.

## Validation

Verify the complete journey on desktop and a narrow mobile viewport: keyboard
and touch controls, typing completion, candle button, reveal, and replay. Check
that repeated inputs cannot skip or duplicate scenes, all content fits, and no
console errors or missing assets occur. Verify mute and reduced-motion behavior.
Check microphone denial/unavailability and track cleanup; actual breath response
requires a real microphone and will be reported separately if unavailable in the
test environment.

## Delivery boundary

Deliver the working local website using the supplied personal photos and message,
plus usage instructions. Public hosting remains a separate follow-up action once
hosting details are available.

## Supplied asset inspection — 30 September 2026

- `cake/source/Cake_333.zip` contains Blender, FBX, OBJ, MTL, and texture files.
  The OBJ contains 2,970 vertex records and 3,057 face records, with objects named
  `Cake`, `Yummy`, `Berry`, and `Candles`. These names do not establish the number
  of candles. Ensure the final scene contains one candle as requested.
- The OBJ has no ready-made left/right cake objects. Prepare the opening effect
  with two clipped copies and matching cut surfaces, preserving decorative
  pieces on their corresponding side. Validate this visually before relying on
  it for the final reveal.
- The cake MTL points at `C:/Cake_3.png`; remap it to a local web asset.
- `letter/source/PaperAndInk.fbx` is binary FBX. Its texture references include
  absolute paths from its creator's machine; remap these to the supplied
  `letter/textures/PaperAndInk_Texture.png`.
- Both supplied texture images were opened and inspected. Cake colors include
  pastel pink, white, lavender, and bright sprinkle details. The letter texture
  includes warm paper tones, muted dark ink, and blue feather-like elements.
- Model silhouettes and assembled materials have not yet been rendered; file
  inspection alone does not verify the final appearance or animation readiness.
- Several photos are large (up to 8,256 × 5,504 pixels); resize delivery copies.
- No table asset has been supplied or generated yet. The table described above
  is the selected design for implementation, not an existing deliverable.

## Review

Self-reviewed for consistent scene transitions, complete fallback behavior,
responsive presentation, and clear treatment of missing personal assets. The
workspace was empty and has no Git repository, so this design is saved locally
without a Git commit.
