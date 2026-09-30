---
name: Candlelit keepsake
description: A private birthday gift for Ani; warm paper, rose ink and candlelight around a pink cake.
colors:
  paper: "#f6eee4"
  ink: "#653641"
  rose: "#b25b76"
  blush: "#e9a6b0"
  ivory: "#fff3df"
  brass: "#bb8c50"
  cocoa: "#201312"
  night: "#241816"
  print: "#fff8ef"
  portrait-mat: "#fffaf4"
  peach: "#f1cfbd"
  peach-lit: "#ffe4d4"
  pill-ink: "#422b29"
  lao-blush: "#f3c3cb"
  pulse-blush: "#ffd7df"
typography:
  display:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Didot, Georgia, 'Noto Serif Lao Variable', serif"
    fontSize: "clamp(52px, 9svh, 104px)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.035em"
    fontVariation: "'opsz' 96"
    fontFeature: "lnum"
  lao-display:
    fontFamily: "'Noto Serif Lao Variable', 'Noto Sans Lao', serif"
    fontSize: "clamp(34px, 4.2vw, 58px)"
    fontWeight: 500
    lineHeight: 1.35
  lao-subline:
    fontFamily: "'Noto Serif Lao Variable', 'Noto Sans Lao', serif"
    fontSize: "clamp(18px, 1.7vw, 24px)"
    fontWeight: 400
    lineHeight: 1.6
  headline:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Didot, Georgia, 'Noto Serif Lao Variable', serif"
    fontSize: "clamp(45px, 6vw, 72px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Didot, Georgia, 'Noto Serif Lao Variable', serif"
    fontSize: "clamp(28px, 2.7vw, 42px)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  caption:
    fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Didot, Georgia, 'Noto Serif Lao Variable', serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "'Noto Sans Lao', Tahoma, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Noto Sans Lao', Tahoma, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.2
  mono:
    fontFamily: "'Victor Mono Variable', 'Victor Mono', ui-monospace, Consolas, monospace"
    fontSize: "clamp(16px, 1.15vw + .95svh, 31px)"
    fontWeight: 430
    lineHeight: 1.8
    letterSpacing: "0.01em"
rounded:
  hairline: "2px"
  sm: "3px"
  frame: "4px"
  md: "5px"
  card: "6px"
  pill: "999px"
  round: "50%"
spacing:
  header-x: "42px"
  header-x-mobile: "22px"
  welcome-rows: "clamp(14px, 2.6svh, 30px)"
  welcome-footer-gap: "clamp(22px, 3vw, 40px)"
  polaroid-mat: "9px 9px 30px"
components:
  enter-ring:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    width: "clamp(94px, 11svh, 124px)"
    height: "clamp(94px, 11svh, 124px)"
  enter-ring-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.round}"
  portrait-frame:
    backgroundColor: "{colors.portrait-mat}"
    rounded: "{rounded.sm}"
    padding: "clamp(5px, .7svh, 9px)"
  mic-pill:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.pill-ink}"
    rounded: "{rounded.pill}"
    padding: "7px 26px 7px 7px"
    height: "56px"
  mic-pill-hover:
    backgroundColor: "{colors.peach-lit}"
    textColor: "{colors.pill-ink}"
    rounded: "{rounded.pill}"
  mic-icon-disc:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.round}"
    size: "42px"
  backup-pill:
    backgroundColor: "#fff3df12"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  polaroid:
    backgroundColor: "{colors.print}"
    rounded: "0"
    padding: "{spacing.polaroid-mat}"
    width: "clamp(118px, 17svh, 158px)"
  letter-hint:
    backgroundColor: "{colors.print}"
    textColor: "#4a2c30"
    rounded: "{rounded.card}"
    padding: "14px 18px"
    width: "min(300px, calc(100% - 32px))"
  photo-viewer:
    backgroundColor: "{colors.print}"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "12px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#fff4e9"
    rounded: "{rounded.sm}"
    typography: "{typography.label}"
    padding: "12px 30px"
    height: "49px"
  button-primary-hover:
    backgroundColor: "#7e4353"
  button-primary-light:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.pill-ink}"
    rounded: "{rounded.sm}"
    padding: "12px 30px"
    height: "49px"
  button-primary-light-hover:
    backgroundColor: "{colors.peach-lit}"
  icon-button:
    backgroundColor: "transparent"
    rounded: "{rounded.round}"
    size: "44px"
  terminal-continue:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    typography: "{typography.mono}"
---

# Design System: Candlelit keepsake

## Overview

**Creative North Star: "Candlelit keepsake"**

An intimate birthday table, viewed from just above a seated person's eye line. The scene itself leads. A walnut pedestal table, ivory linen, pink cake, and paper-and-ink keepsake sit in a warm pool of light. Typography and controls stay at the periphery of the cake scene; no dashboard cards or UI-chrome labels in the gift. The supplied assets and the user's selected candlelit direction are the visual authority: do not reopen a concept tournament or replace the supplied models with generated imagery.

The gift moves from paper to night and unfolds in order. It opens on warm paper with the date set small and exact in Bodoni above her portrait, a print-white framed photograph that fills the middle of the screen; the greeting and a round Enter sit beneath it. Entering dissolves the paper to night cocoa, and a quiet full-screen terminal types to her in a cursive monospace. The cake room then lights in stages: one flame alone in the dark, a dozen sparkles rising, then the room. The paper surfaces (welcome, gallery, letter, prints) and the dark surfaces (terminal, cake room) share one ink family.

The signature is the candle-first intro and the memories that follow the wish: once the flame is blown out, print-white photos pop from the cake on a spring and settle in a row, a print-white hint points to the letter on the table, and reading it to the end opens the gallery. Motion is concentrated in these transitions; reduced-motion users get the same story without flicker or travel.

**Key Characteristics:**
- Warm paper and rose ink by day; night cocoa, scene night and candle ivory after Enter.
- Bodoni Moda for Latin display, Noto Serif Lao for the Lao wish; Victor Mono only in the terminal.
- Physical paper is print white: the portrait mat, polaroids, the letter hint and the photo viewer.
- Circles, pills and hairlines: round and pill controls, 1px brass or ink rules, small corners on paper objects.
- Motion is slow, eased (cubic-bezier(.16,1,.3,1)) and story-bearing; only the photo pop overshoots (cubic-bezier(.34,1.45,.64,1)).

## Colors

A warm, low-saturation paper-and-candle palette with one accessible rose accent, a peach tactile note on the dark room, and a single metallic.

### Primary
- **Rose Ink** (ink): primary text on paper, the Enter ring's stroke and fill, primary buttons on paper, and the dark disc inside the microphone pill.

### Secondary
- **Dusk Rose** (rose): the accessible accent on paper at display scale. The italic 9 of the date, "special day." in the greeting, the Enter focus ring, and the microphone's listening pulse ring. Large or italic display text only.
- **Blush** (blush): accent on dark surfaces: the terminal block cursor, the terminal continue underline, text selection.
- **Lao Blush** (lao-blush): the Lao wish subline under the ivory name in the cake room.
- **Pulse Blush** (pulse-blush): the tap-target pulse rings on the table letter and its focus ring.
- **Peach** (peach) and **Peach Lit** (peach-lit): the one warm fill on the dark room: the microphone pill and the light primary button at rest and on hover. Always carries Pill Ink (pill-ink) text.

### Tertiary
- **Aged Brass** (brass): hairlines, halos and punctuation. The two date dots, the vertical rule beside the greeting (brass at 60% alpha), the faint halo ring around Enter, terminal ">" prompts, table details in the scene. Never a fill.

### Neutral
- **Warm Paper** (paper): welcome, gallery and letter surfaces; theme-color on the welcome.
- **Print White** (print): photographs and paper objects in the cake room and viewer: polaroids, the letter hint card and its arrow, the photo viewer mat and its close button.
- **Portrait Mat** (portrait-mat): the border of the welcome portrait only; a shade whiter than print so it reads on paper.
- **Candle Ivory** (ivory): primary text on dark; the current terminal line and the Lao wish name. Earlier terminal lines settle to ivory at about 58% alpha (65% on mobile).
- **Night Cocoa** (cocoa): the terminal and the paper-to-night dissolve; theme-color while the terminal runs.
- **Scene Night** (night): the cake room and its vignette; theme-color from the cake room onward.

### Named Rules
**The Scene Owns the Chrome Rule.** The browser theme-color follows the scene: paper on welcome, cocoa in the terminal, scene night thereafter.

**The Brass Is Metal Rule.** Brass appears as line, halo or punctuation, never as a filled shape. On the welcome it is exactly the two date dots, one vertical rule and the Enter halo.

**The Print White Rule.** Anything that is a physical print or card in the story is print white, never paper and never pure #fff; paper is the ground, print sits on it or on the night.

## Typography

**Display Font:** Bodoni Moda Variable, optical-size axis (with Didot, Georgia, Noto Serif Lao Variable, serif)
**Lao Display Font:** Noto Serif Lao Variable (with Noto Sans Lao, serif)
**Body Font:** Noto Sans Lao (with Tahoma, sans-serif)
**Label/Mono Font:** Victor Mono Variable, terminal only (with ui-monospace, Consolas, monospace)

**Character:** A razor-contrast Didone for dates, greetings and captions, a calm Lao serif for the wish so the Lao heading has the same ceremony as the Latin, and a quiet Lao-capable sans for running text. The terminal speaks in a monospace whose italic turns cursive. All faces are self-hosted via Fontsource.

### Hierarchy
- **Display** (500, clamp(52px,9svh,104px), 0.9, opsz 96; mobile clamp(46px,14vw,60px)): the welcome date 30.9.2026 on one line. Day and year upright 500; the 9 italic 400 in Dusk Rose; the dots 400 in brass. Lining numerals.
- **Lao Display** (500, clamp(34px,4.2vw,58px), 1.35; mobile clamp(26px,8vw,32px)): the Lao wish name in ivory, balanced wrap.
- **Lao Subline** (400, clamp(18px,1.7vw,24px), 1.6; mobile 16px): the Lao wish line under it in Lao Blush.
- **Headline** (400, clamp(45px,6vw,72px), 1.05): gallery heading; the letter heading at 56px (47px mobile). An italic `em` carries the name or key phrase in a rose tone.
- **Title** (400, clamp(28px,2.7vw,42px), 1.06; mobile clamp(26px,8vw,32px)): the welcome greeting; its `em` breaks to its own line in Dusk Rose.
- **Caption** (italic 400, 13-23px, display face): polaroid captions 13px (11px mobile), gallery captions 15px, gallery subtitle and viewer caption 19px, the Enter label 23px (21px mobile).
- **Body** (400, 15px, 1.6; letter 15px at 2.05): welcome note, letter hint, the Lao letter, the wish prompt (17px on dark).
- **Label** (400/500, 12-15px): button and status text; the microphone pill label is 500 at 15px (14px mobile).
- **Mono** (430, clamp(16px,1.15vw + .95svh,31px), 1.8): terminal lines with a 2ch hanging indent. The birthday greeting line is Victor Mono italic at 1.3em (1.12em mobile), 1.5 line-height, in light blush.

### Named Rules
**The Optical Size Rule.** The display date always sets `opsz` 96; do not let the browser pick a text-size cut for it.

**The Lao Gets a Serif Rule.** Lao display text is Noto Serif Lao, never the Latin Didone's fallback and never the body sans at display size.

**The Terminal-Only Mono Rule.** Victor Mono never appears outside the terminal.

## Layout

**Welcome.** A full-viewport three-row grid (auto / minmax(0,1fr) / auto), everything centred: the date on top, the portrait filling the flexible middle row (image max-height 100% of the row, max-width min(86vw,640px)), the footer below. Row gap clamp(14px,2.6svh,30px); padding clamp(28px,5svh,56px) 24px clamp(22px,4.2svh,46px); min-height 640px. The footer pairs the greeting, right-aligned against a 1px brass rule, with the Enter ring to its right (gap clamp(22px,3vw,40px)). At 700px and below the footer stacks and centres (greeting, then Enter), the rule is dropped, and the portrait is capped at calc(100svh - 360px) so the whole welcome fits one screen down to 360x740. The keyboard hint is hidden on coarse-pointer touch devices. The header holds only the sound toggle, top-right (28px 42px; 20px 22px mobile).

**Terminal.** Full screen, no window chrome, text starting at clamp(76px,15svh,168px) from the top with side margins clamp(22px,9vw,160px); 20px sides on mobile. The header fades out and returns on hover or focus.

**Cake room.** Lao heading centred in the upper negative space (84px from the top; 72px mobile; 110px at 1600px+), cake and table centred, wish prompt and microphone anchored low (56px from bottom; 44px mobile). After the wish, the reveal dock replaces them at the bottom: the row of polaroids, then the gallery button beneath. The letter hint floats beside the table letter with an arrow pointing to it. A footer line sits 18px from the bottom and hides during the intro and reveal.

**Dialogs.** The letter opens as a readable paper sheet (max 730px). The photo viewer is a print-white mat up to min(92vw,960px) and 94svh, the photo capped so the caption always fits.

## Elevation & Depth

Paper surfaces are flat and lit by soft radial washes (a pale highlight top-left, a blush warmth bottom-right). Depth on dark surfaces comes from the 3D scene, the vignette gradient and shadows under physical objects.

### Shadow Vocabulary
- **Enter halo** (`box-shadow: 0 0 0 8px var(--paper), 0 0 0 9px #bb8c5070`): a detached brass ring around the Enter control.
- **Portrait lift** (`box-shadow: 0 26px 60px -18px #6536414d, 0 3px 10px #6536411f`): the framed portrait resting on paper; ink-tinted, never grey.
- **Photo lift** (`box-shadow: 0 18px 40px #13090670`; hover `0 26px 50px #13090680`): polaroids over the table.
- **Card float** (`box-shadow: 0 16px 40px #12060680`): the letter hint card.
- **Letter float** (`box-shadow: 0 25px 100px #12060680`): the letter dialog.
- **Viewer float** (`box-shadow: 0 30px 100px #0d050599`): the photo viewer.
- **Pill rest** (`box-shadow: 0 12px 30px -10px #0d050480`): the microphone pill, the one raised control in the dark room.
- **Button lift** (`box-shadow: 0 7px 20px #65364120`): primary button hover only.

### Named Rules
**The Physical Object Rule.** Shadows belong to things that could exist on the table (the portrait print, photos, the hint card, the letter, the viewer mat), to the raised microphone pill, or to a state response; never to layout containers.

## Shapes

Circles, pills and hairlines. Stand-alone controls are round (the Enter ring, icon buttons, the mic icon disc) or full pills (the microphone button and its backup, 999px). Rectangular buttons carry a 3px corner. Paper objects keep small corners: gallery photos 2px, the portrait 3px, the viewer 4px, the letter 5px, the hint card 6px with a rotated-square arrow; polaroids are square-cornered and tilted by a per-photo rotation. Rules are 1px lines: brass beside the greeting, a muted rose rule in the letter, underlines on text buttons. Tap targets on the 3D scene are marked by concentric blush rings, not boxes.

## Components

### Buttons
- **Enter ring (signature):** a circle (clamp(94px,11svh,124px); 88px on mobile) with a 1px ink stroke, italic "Enter" and an arrow. Hover and focus flood it with ink from the center (.6s), turn the label paper, tilt it -4deg and nudge the arrow 5px; active presses to .96. Focus adds a 2px Dusk Rose outline at 15px offset.
- **Microphone pill (signature):** peach pill with a 42px Rose Ink disc holding the ivory mic glyph at its left, 500-weight label, pill-rest shadow. Hover brightens to Peach Lit and lifts 2px. While listening, a 1.5px Dusk Rose ring pulses out from the disc (scale .9 to 1.35, 1.4s). Mobile: 52px tall, 38px disc.
- **Backup pill:** appears only after microphone failure. 48px outline pill, 1px peach at 50% alpha, ivory at 7% fill, ivory 14px/500 text; hover deepens fill and border. Enters with the hint-in rise.
- **Primary:** ink on paper (#fff4e9 text), 3px radius, 49px min-height, 12px 30px padding, 13px label; hover deepens and lifts 2px. On the dark room the light variant is peach with Pill Ink text (the gallery button in the reveal dock); the letter's end-of-read gallery button is the ink variant.
- **Text button:** underline-only, 12px, for tertiary choices (retry, replay).
- **Icon button:** 44px circle, 1px currentColor stroke, 80% opacity at rest. Over the viewer it becomes a 40px print-white disc overlapping the mat's corner.

### Portrait Frame
The welcome portrait: the photo with a clamp(5px,.7svh,9px) Portrait Mat border, 3px corners and the ink-tinted portrait lift. It rises in with a blur (1.6s, .2s delay) and blurs out on Enter.

### Polaroids
Print-white prints (clamp(118px,17svh,158px); 112px mobile) with a 9px mat and 30px bottom lip holding an italic 13px caption. Each pops out of the cake on a spring (1.25s, overshoot to 1.07 then settles at its own tilt), .8s apart, and rests in an overlapping row with the middle print raised. Hover or focus straightens, lifts 8px and scales 1.04; click opens the viewer.

### Letter Hint and Hotspot
The hint is a print-white card (max 300px) with an arrow on the side facing the letter, 15px body text in deep rose-brown, arriving on the spring. The table letter carries a pulse-blush ring (2.2s pulse outward) inside a fainter fixed inner ring.

### Dialogs
- **Letter:** paper sheet, 5px corners, letter float over a near-black backdrop; sticky round close; after the reader reaches the end, the gallery button fades up below the heart.
- **Photo viewer:** print-white mat, 12px padding (8px mobile), 4px corners, italic 19px ink caption beneath; scales in from .96 (.45s).

### Terminal
- **Lines:** newest line full ivory, earlier lines dim ivory (1.4s color settle). Brass ">" prompts. The greeting line is cursive Victor Mono italic in light blush.
- **Cursor:** a blush block (.58em by 1.08em) blinking in steps; solid while keys are being struck.
- **Pace:** slow and unskippable (about 30s), driven by real keystroke sound slices.
- **Continue:** the final line becomes a full-width button with a thin blush underline that breathes (opacity to .62 over 2.8s); focus shows a dashed blush outline.
- **Exit:** the text blurs (6px) and fades over .9s before the cake room.

### Cake Room Intro
Flame alone (0.3-2s), 12 sparkles in warm ivory and pale blush rising in one by one (2.1-4.3s), then the room lights (4.9-8.2s). The heading and wish controls rise in only after (1.6s and 1.2s, controls delayed .9s); the header and footer stay hidden until then.

### Transitions
- Load: the date rises through its mask (1.5s), the portrait blurs in (1.6s, .2s delay), the footer fades up (1.3s, .7s delay).
- Enter: the date sinks upward (.8s, accelerating), the portrait blurs out, and the paper dissolves to cocoa (.9s) before the first keystroke sounds.

## Do's and Don'ts

### Do:
- **Do** set the welcome date in Bodoni at opsz 96 with the 9 italic in Dusk Rose and brass dots.
- **Do** frame photographs as prints: Portrait Mat on the welcome, Print White everywhere in the cake room and viewer.
- **Do** set Lao display text in Noto Serif Lao; keep Victor Mono inside the terminal.
- **Do** keep peach as the only fill on the dark room, always with Pill Ink text.
- **Do** switch theme-color with the scene (paper, cocoa, scene night).
- **Do** give reduced-motion users the same story with durations collapsed.
- **Do** use the supplied cake, letter models and photos; take user copy (captions, hint, backup label, UI strings) from content.json verbatim.

### Don't:
- **Don't** set body text or small labels in Dusk Rose or Blush on paper or print; they are display-scale accents.
- **Don't** fill shapes with brass; it is a hairline, halo and punctuation metal.
- **Don't** add window chrome, title bars or traffic lights to the terminal; it is a full-screen voice.
- **Don't** show the backup blow button before the microphone has failed.
- **Don't** replace the supplied models with generated imagery or box the cake room in dashboard cards.
