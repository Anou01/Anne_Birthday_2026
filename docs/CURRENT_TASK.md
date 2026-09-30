# Session handoff — birthday surprise

Last updated: 2026-09-30 (Asia/Vientiane).
Workspace: `E:\Cake`. Not a Git repository (no version history to roll back to).

## Current status

**The website is implemented and works locally. The user deployed it to Vercel.**

Deployment (user ran it themselves, 2026-09-30 evening):
- `npm run build`, then `npx.cmd vercel deploy dist --prod`. Only the prebuilt
  `dist/` is uploaded, so the original photos and models are not.
- Vercel project `anou01s-projects/anne_birth`. Production alias
  https://annebirth.vercel.app. Deployment URL
  https://annebirth-lgw6d8mfa-anou01s-projects.vercel.app.
- The CLI reported "Deployment Protection is on (Vercel Authentication)".
  Whether the alias is public was **not verified**: this agent's sandbox cannot
  resolve external hosts. The user was asked to check in a private window.
- To redeploy after edits: `npm run build`, then the same deploy command.
  A rebuild empties `dist/`, which removes `dist/.vercel`, so the CLI may ask
  again. Choose the existing `anne_birth` project.
- Not verified: real-phone microphone blowing on the HTTPS site.

The full flow (welcome → terminal → cake scene → reveal → letter/gallery →
replay) exists in `index.html` and `src/`, runs with `npm run dev`, and passed
the automated checks listed below. The user has now asked to fix the remaining
issues one at a time, together. Do not batch several fixes without asking.

`docs/superpowers/plans/2026-09-30-birthday-build.md` still has unticked
checkboxes; its Tasks 1–4 were in fact carried out (see "Verification"), except
that an independent final review has no recorded result.

## Latest change (2026-09-30, ~20:15): birthday music + Lao UI

- **User decision:** keep the letter heading "For you, Ani.". The earlier "remove for Ani" request meant only the header mark and the corner note. The meta description is unchanged.

- **Music:** the user's `music/soulprodmusic-happy-birthday-piano-508359.mp3`
  (44.85 s, no leading silence, 1.4 s silent tail) is copied to
  `public/assets/audio/birthday-piano.mp3`.
  - `src/music.js` uses Web Audio. It fetches and decodes the file on the first
    welcome Enter, then **starts on the Enter that leaves the terminal**
    (measured 19 ms after the click). It fades in over 2.4 s, so the first soft
    phrase meets the candle, and the fuller section (~19 s) lands around the
    wish and reveal.
  - It loops 0.45–43.4 s without the tail.
  - It is ducked to 16% while the mic listens, so the song is not mistaken for
    a blow, and stops on replay.
  - The sound toggle mutes it, and it pauses when the tab is hidden.
  - iPhone: `navigator.audioSession` is set to `playback`, so the silent switch
    doesn't mute it, and to `play-and-record` while the mic listens.
  - Real-device playback, including iPhone, is **not verified**.
- **Lao UI:** the user translated part of `index.html` themselves at 20:07.
  Their wording is kept verbatim: skipScene, galleryButton (two variants),
  hintOpen, galleryLetter, replay, retryLetter, and the close/photo labels.
  - In `content.json`, those `ui` keys are `""`, so the user's HTML wording
    shows.
  - The assistant translated everything that was still Thai into Lao: the mic
    status lines, scene loading/error/retry, letter and photo errors,
    `letterHint`, `micFallback`, and the aria-labels.
  - `<html lang="lo">`; the English sections (welcome, terminal, gallery
    heading, footer, letter title) are marked `lang="en"`.
  - No Thai remains on the page.
- **Checks:** `npm test` 2/2. `verify-browser.mjs` passes, now also checking
  that the music file loads. `verify-fallbacks.mjs` passes on the production
  build.

## Earlier (2026-09-30, later evening): portrait welcome + new cake-room story

This supersedes the "monument date" welcome and the cake-split reveal below.
User requirements, as the user wrote them:
- **Welcome:** the date on top; the user's portrait `photo/Anne_Birthday.png` in
  the centre; "This is a special day." and "A little surprise, just for you."
  below; the same round Enter. The "made with love, for Ani" note and the
  header "for Ani." mark are removed.
- **Terminal → cake:** a slow fade-in. First the candle and flame, then a few
  stars, then the room.
- **Cake room copy:** the English heading is replaced by
  "ສຸກສັນວັນເກີດເດີອານິ ອະທິຖານ!! ແລ້ວຄຳຂໍຈະເປັນຈິງຄັບ", then
  "ກົດປູ່ມໃຊ້ໄມເດີ! ຫລັບຕາແລ້ວອາຖິຖານ". The mic button reads "ໃຊ້ໄມເພື່ອເປົ່າເຄັກ".
  All Lao text is exactly as typed; do not correct it.
- **Blowing:** microphone only. The user chose a backup button that appears
  **only** after mic failure or no blow heard.
- **Reveal:** no cake split. After the candle goes out, **3** photos pop up one
  by one, and each opens large with a caption the user will write.
- **Letter and gallery:** then an alert says to tap the letter on the table.
  After the letter is read to its end, the Gallery button appears.

Implemented and verified:
- **Welcome:** 30.9.2026 on top, the portrait in a print-white frame (WebP
  copies `anne-birthday*.webp` made by `prepare_assets.py`), the greeting beside
  the round Enter. Fits one screen at 1440×1000, 390×844 and 360×740.
- **Intro** (`scene.js` `intro()`): flame at 0.3–2 s, 12 sparkle stars appear and
  rise at 2.1–4.3 s, room lights at 4.9–8.2 s. The Lao words and the mic button
  appear after that. With reduced motion everything shows at once.
- **Cake room:**
  - Lao heading set in Noto Serif Lao Variable (new dependency).
  - A blush pill mic button. The backup `#blow-button` is a 48px pill shown only
    after the mic fails.
  - After blowing, the flame goes out with a smoke wisp and the candle stays.
  - `slice.js` and its test were deleted because the cake split is gone.
- **Photos:** 3 polaroids pop out of the cake into a bottom row. Tapping one
  opens `#photo-dialog`.
- **Letter:** a hint card points at the table letter, which glows and has a
  pulse-ring `#letter-hotspot` (also keyboard-accessible). The hint's own
  "open" button appears only if the 3D scene failed. The letter's end must stay
  in view for ≥2.5 s before `#letter-gallery` (inside the letter) and
  `#after-letter` (on the table) appear.
- **Gallery:** tapping a gallery photo also opens the viewer. Replay lives in
  the gallery.
- **`public/assets/content.json`** (the user edits this):
  - `revealPhotos` [2, 4, 9] and `captions` per photo number (all empty).
  - `letterHint` and `micFallback`: **English placeholders awaiting the user's
    Lao text**.
  - `ui`: every visible Thai string (mic status, gallery button, errors). The
    user may replace them with Lao; they were not translated for them.
  - Only aria-labels stay hard-coded Thai.
- **Checks:**
  - `npm test` 2/2.
  - `verify-browser.mjs` passes the full new journey on desktop and mobile, on
    dev and on the production build, with no console errors. The staged intro
    is covered at normal motion.
  - `verify-fallbacks.mjs` passes (missing cake model, missing letter).
- **Impeccable:**
  - Final reviewer verdict: **ship** after two fix rounds. The verdict pass
    scored all 8 fixes; it was not a new full-surface review. Its minor
    non-blocking note: at 360px one sparkle can sit near the first Lao glyph of
    the heading.
  - `DESIGN.md` and `.impeccable/design.json` were rewritten from the shipped
    build.
  - The finish reviewer's first pass returned "fix" with 8 items.
  - Fixed: the black-cake intro, a letter-end button hidden below the sheet, a
    link-sized mic backup, UI strings moved to `content.json`, too many tiny
    stars, and the 7–8px footer (now 11px).
  - Needing the user: the placeholders, and whether "for Ani" also covers the
    letter heading "For you, Ani." and the meta description.
  - Raster provenance is embedded in every WebP/PNG. Note that re-running
    `prepare_assets.py` strips it.
- **Open questions for the user:**
  - Lao text for `letterHint`, `micFallback` and the `ui` strings.
  - Captions.
  - ~~Whether to change the letter heading~~ decided: keep "For you, Ani.".
- **Not verified:** real microphone blowing on a phone. The mic needs HTTPS or
  localhost, so it will not work over a plain-http LAN address.

## Earlier session (2026-09-30 evening): welcome + terminal redesign

The user asked to start with the opening pages (before the Known issues list):
keep colors/mood, make it less cliché, show the date prominently, nicer
button and fonts. For the terminal, use `music/Sound_keybord.mp3` synced to the
typing, slow and readable, full screen on desktop and mobile, and no skip or
show-all control. The user's answers were: date huge full-screen; ~30 s typing;
the last line is tappable to continue. On the Impeccable decision page, the user
picked the **"monument date"** layout.

Implemented and verified:
- **Fonts:** Bodoni Moda Variable (display, replaces Cormorant site-wide) and
  Victor Mono Variable (terminal only; its cursive italic is used for the
  greeting). Both are self-hosted via `@fontsource-variable`.
  `@fontsource/cormorant-garamond` was removed.
- **Welcome:** giant 30 / 9 / 2026 numerals on a diagonal (italic rose 9). The
  greeting has a brass hairline and a circular ink-fill Enter ring. Numerals
  rise in on load; Enter sinks them and fades to cocoa. On mobile the numerals
  stack and fit one screen down to 360×740, and the "or press Enter" hint is
  hidden on touch.
- **Terminal:** full screen with no window chrome; the header hides and
  reappears on hover/focus. Newest line is bright and older lines dim. Typing
  takes ~34 s (measured) and cannot be skipped. The last line becomes a
  `#terminal-continue` button; Enter, click, or a tap anywhere continues.
  `?typing=fast` exists for automated checks only.
- **Sound:** `public/assets/audio/keys.mp3` is the 2.35–9.0 s typing part of the
  user's recording (the original is untouched). `src/audio.js` plays one real
  keystroke slice per character from 69 measured onsets; spaces are softer.
  `prepare_assets.py` regenerates the cut with ffmpeg.
- **theme-color** follows the scene.
- **Design docs:** `DESIGN.md` and `.impeccable/design.json` were rewritten by
  the Impeccable documenter. The direction contract is in
  `.impeccable/surfaces/index-html.md`.
- **Review:** the Impeccable finish reviewer's first pass returned "fix" with 7
  items plus one regression. All were applied and the verdict pass scored them
  resolved; the last open item, DESIGN.md, was completed after that.
- **Checks:** `npm test` 3/3; `verify-browser.mjs` found no errors or warnings.
  Updated captures are in `.impeccable/review/` (`*-welcome.png`,
  `*-terminal.png`, `user-360-*`).
- **Not verified:** how the keystroke audio sounds on a real phone speaker.
  Automated checks cannot hear it.
- **Pre-existing drift noted by the documenter, not fixed:** the "↗" glyph in
  the letter link, the 7–8px scene footer, and a few off-palette inks.
- **Next:** continue the Known issues list one at a time with the user.

## User requirements and decisions

- Birthday website for the user's girlfriend, Ani / ອານິ, on 30.9.2026.
- Welcome heading “This is a special day”, the date, and an Enter button.
- Fade to a dark terminal; type the supplied message with keyboard sounds.
- Another Enter shows a table with a centered pink-and-white dimensional cake,
  one candle, an animated flame and soft lighting.
- Blowing out the candle opens the cake and photos slide out.
- Use the supplied cake and letter models, `Bless.txt`, `Name.txt` and photos.
  The user asked for a beautiful matching table and delegated its styling.
- Preserve originals and the exact wording of the Lao letter.

## Implemented behavior

- **Stack:** static HTML/CSS + native JS modules, Three.js 0.186.1, Vite 8.3.1,
  self-hosted Cormorant Garamond and Noto Sans Lao (`@fontsource`). Node 24.14.1.
- **Flow state machine:** `src/flow.js` — `welcome → terminal → cake → reveal`,
  `REPLAY` resets. Enter during typing completes text; typing must finish before
  the next Enter advances. Repeated input cannot duplicate transitions.
- **Terminal:** `src/main.js` types the 11 lines (with 30.9.2026 filled in),
  Web Audio clicks (`src/audio.js`), blinking cursor, full text exposed to screen
  readers, button equivalent for touch. Scene loading starts during typing.
- **3D scene:** `src/scene.js`
  - `src/table.js`: original lathe-built round walnut table with a brass rim,
    pedestal and collar, and an ivory linen mat. `src/materials.js` provides
    canvas-drawn wood, linen and glow textures.
  - The supplied cake OBJ has its original `Candles` object removed and is
    rescaled onto a porcelain plate. It is replaced by one generated striped
    candle with a flickering flame, glow sprite and point light.
  - The supplied letter FBX (texture remapped) sits beside the cake. Clicking it
    opens the letter.
  - Camera framing changes for narrow screens (aspect < 0.8).
- **Blow:** button always available; optional mic (`src/microphone.js`) measures
  ambient level for 650 ms, then triggers on RMS > max(0.055, 2.8× baseline)
  sustained 220 ms. Times out after 16 s, stops tracks on detection, replay, tab
  hide and pagehide, and shows Thai fallback messages.
- **Reveal:** flame shrinks, candle disappears, the cake splits into two halves
  via clipping planes. `src/slice.js` computes real cross-section contours of all
  three tiers for the sponge-textured cut faces. Three polaroids rise (photos
  index 1, 3, 8 of `photos.json`). Buttons offer the letter, a gallery of all 13
  photos and “ดูอีกครั้ง” (replay).
- **Letter:** `<dialog>` showing `assets/letter.txt` (byte-exact copy of
  `Bless.txt`) with `lang="lo"`. It has a retry if loading fails, and closes with
  Escape, the backdrop, or the close button (focus is restored).
- **Also:** sound toggle, reduced motion (instant typing and no animated
  reveal), a scene-load error panel with retry/skip, and `?scene=cake` to jump
  directly to the table for local preview.

## Assets

- Originals untouched: `cake/`, `letter/`, `photo/` (13 images), `Name.txt`,
  `Bless.txt`.
- Delivery copies in `public/assets/`, generated by `scripts/prepare_assets.py`
  (Python + Pillow): `models/cake.obj`, `cake.png` (from the zip), `letter.fbx`,
  `letter.png`, `letter.txt`, `name.txt`, `photos/memory-01..13.webp`
  (≤1500 px) and `photos.json`. The contact sheet is `.local/photo-contact-sheet.jpg`.
- `dist/`: a production build exists (built 18:28). `src/styles.css` was
  modified afterwards (18:31), so **rebuild before hosting**.

## Verification (actually run)

- `npm test`: 3/3 pass (flow order and replay, and slice contour of an
  L-shape). Re-run 2026-09-30.
- `scripts/verify-browser.mjs` (Playwright + Chrome, reduced motion, desktop
  1440×1000 and mobile 390×844). Each covers welcome, terminal, the loaded 3D
  scene, exact Lao letter equality, Escape, denied-mic fallback, the 3-photo
  reveal, the 13-photo gallery, replay and no horizontal overflow. A
  normal-motion run covers keyboard entry, skip typing, mute and the animated
  reveal. Result: no errors or warnings (`.impeccable/review/browser-report.json`).
- `scripts/verify-fallbacks.mjs`: missing cake model at 320 px (error, then skip
  still gives memories and the letter), and missing letter with a working retry
  (`.impeccable/review/fallback-report.json`).
- Screenshots in `.impeccable/review/` show the table, cake, candle, letter
  model and the reveal rendering correctly.
- **Not verified:** real microphone blowing on a phone or real mic, any public
  deployment, and an independent final review.

## Known issues and gaps (to fix one at a time with the user)

1. **Invented captions:** `main.js` hard-codes the polaroid captions “you & me”,
   “a little happiness” and “my favorite person”. The spec says not to invent
   captions. Alt text is generic (“Our memory N”). Ask the user for the wording.
2. **Hard-coded polaroid choice:** photos index 1, 3 and 8. Confirm with the user.
3. **Stale `dist/`:** rebuild after changes (even more stale after the redesign).
4. **Name hard-coded:** the name is written into `index.html` and `main.js`;
   `assets/name.txt` is copied but unused.
5. **Spec proposals not implemented:** smoke wisp after the flame and subtle
   floating hearts. These were proposals, not confirmed user requirements.
6. **Mic heuristic:** it is loudness-based, so any sustained noise can trigger
   it. It needs a real-device test.
7. **Plan checkboxes are unticked**, although the work was done.
8. **No Git:** consider `git init` before larger edits (ask the user first).

## Commands

```powershell
npm run dev                      # http://127.0.0.1:5173 (?scene=cake)
npm test
node scripts/verify-browser.mjs  # needs dev server on 5173 and Chrome
npm run build; npm run preview   # preview on 4173
node scripts/verify-fallbacks.mjs  # default 4173
python scripts/prepare_assets.py # regenerate public/assets from originals
```

## Suggested prompt for the next session

“อ่าน AGENTS.md และ docs/CURRENT_TASK.md ใน E:\Cake เว็บทำเสร็จแล้ว
ช่วยแก้รายการใน Known issues ทีละข้อร่วมกับฉัน”
