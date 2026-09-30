---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Opening, terminal and cake room (index.html)

Scope: #welcome, #terminal, #birthday (cake room), letter/photo dialogs, gallery. Mode: Experience.
Audience: Ani, opening a private gift on 30.9.2026, phone or laptop.
Constraints: keep DESIGN.md palette and candlelit mood; user copy verbatim (Lao lines exactly as the user typed them);
typing ~30 s unskippable; microphone is the only way to blow (backup button only after mic failure);
gallery unlocks only after the letter is read to its end.
User decisions (2026-09-30, evening): welcome = date on top, the user's portrait Anne_Birthday.png at the centre,
"This is a special day." + "A little surprise, just for you." below, same round Enter; "made with love" and the
"for Ani" header removed. Terminal → cake: candle and flame first, a few stars, then the room. Heading Lao
"ສຸກສັນວັນເກີດເດີອານິ ອະທິຖານ!! ແລ້ວຄຳຂໍຈະເປັນຈິງຄັບ", then "ກົດປູ່ມໃຊ້ໄມເດີ! ຫລັບຕາແລ້ວອາຖິຖານ" and the mic button
"ໃຊ້ໄມເພື່ອເປົ່າເຄັກ". No cake split: after the candle goes out, 3 photos pop up one by one, each opens large with
a caption the user will write (public/assets/content.json); then a hint to tap the letter on the table
(Lao text to come from the user); after reading the letter, the gallery button appears.

## Direction contract
THESIS: A keepsake that unfolds in order: her portrait under the date, a slow letter-by-letter message, a dark room where one candle finds her first, then the table, the wish, the memories, the letter. Refuses dashboard controls and anything that skips the order.
OWN-WORLD: Warm paper #f6eee4 with rose ink #653641 and rose #b25b76 on the welcome; Bodoni Moda numerals and greeting; a print-white framed portrait (#fffaf4 border, soft ink shadow). Night cocoa terminal in Victor Mono. Cake room night #241816, Noto Serif Lao for the Lao wish in ivory and #f3c3cb, a blush pill microphone button, print-white #fff8ef polaroids and hint card, blush pulse rings for tap targets.
STORY: Ani sees the date and her birthday portrait, presses Enter, reads the typed message, watches the candle glow alone, stars gather, the room lights and the wish appears; she blows into the mic, the flame goes out with a wisp of smoke, three photos pop out of the cake, a hint points to the letter; she reads it to the end and the gallery opens.
FIRST VIEWPORT: Welcome desktop: 30.9.2026 centred on top (Bodoni, rose italic 9, brass dots), the portrait filling the middle row, below it the greeting right-aligned against a brass rule and the round Enter to its right. Mobile: same order stacked and centred, one screen down to 360x740, no keyboard hint on touch.
FORM: User-directed layout (replaces the monument-date structure, seed key 37dbb517, at the user's request 2026-09-30).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
Signature interaction: the staged candle-first intro (flame 0.3–2 s, stars 2.1–4.3 s, room 4.9–8.2 s, words after) and the photos popping out of the cake one by one into a row.
