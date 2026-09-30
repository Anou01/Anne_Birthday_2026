import './styles.css';
import { createFlow } from './flow.js';
import { createKeyboardAudio } from './audio.js';
import { createMicrophone } from './microphone.js';
import { createMusic } from './music.js';

const $ = id => document.getElementById(id);
const base = import.meta.env.BASE_URL;
const flow = createFlow(), audio = createKeyboardAudio(`${base}assets/audio/keys.mp3`);
const music = createMusic(`${base}assets/audio/birthday-piano.mp3`);
// Automated checks only: ?typing=fast shortens the slow reading pace.
const pace = new URLSearchParams(location.search).get('typing') === 'fast' ? .04 : 1;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(resolve => setTimeout(resolve, reduceMotion() ? 0 : ms));
const lines = [
  'booting surprise.exe', 'loading memories...', 'loading special moments...',
  "checking today's date...", 'Today is 30.9.2026',
  'the birthday of someone very special.', 'someone kind.', 'someone cute.',
  'someone who makes my world softer.', 'Happy Birthday, my love.', 'press enter to continue...',
];
let scene, scenePromise, typeTimer, typing = false, muted = false;
let photos = [], letterText = null, transitioning = false, lastFocus;
let content = { revealPhotos: [2, 4, 9], captions: {}, letterHint: '', micFallback: '', ui: {} };
// Words shown on the page live in public/assets/content.json (ui); these are
// only the fallbacks used if that file cannot load.
const UI = {
  'micRequesting': 'ກຳລັງຂໍເປີດໄມ…',
  'micListening': 'ອະທິຖານ ແລ້ວເປົ່າໃສ່ໄມເບົາໆໄດ້ເລີຍ',
  'micNotHeard': 'ຍັງບໍ່ໄດ້ຍິນສຽງເປົ່າ ລອງເປີດໄມອີກຄັ້ງ ຫຼື ກົດປຸ່ມດ້ານລຸ່ມ',
  'micDenied': 'ເປີດໄມບໍ່ໄດ້ ບໍ່ເປັນຫຍັງເດີ ກົດປຸ່ມດ້ານລຸ່ມແທນໄດ້ເລີຍ',
  'micUnsupported': 'ເວັບບຣາວເຊີນີ້ເປີດໄມບໍ່ໄດ້ ກົດປຸ່ມດ້ານລຸ່ມແທນໄດ້ເລີຍ',
  'letterLoading': 'ກຳລັງເປີດຈົດໝາຍ…',
  'letterError': 'ໂຫຼດຈົດໝາຍບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
  'photosError': 'ໂຫຼດຮູບບໍ່ສຳເລັດ ລອງໂຫຼດໜ້ານີ້ໃໝ່ອີກຄັ້ງເດີ',
  'noPhotos': 'ຮູບຍັງໂຫຼດບໍ່ສຳເລັດ ແຕ່ຈົດໝາຍເຖິງເຈົ້າຍັງຢູ່ບ່ອນນີ້',
};
const text = key => content.ui?.[key]?.trim() || UI[key] || key;
let journey = 0; // bumps on replay so stale timers from a previous run stop
let letterRead = false, letterOpenedAt = 0, readTimer;
const mic = createMicrophone(blow, (message, listening) => {
  $('mic-status').textContent = message;
  $('microphone-button').disabled = listening;
  $('microphone-button').setAttribute('aria-pressed', String(listening));
  if (!listening) music.duck(false);
  // The candle can only be blown with the microphone; a quiet backup appears
  // only when the microphone is unavailable or did not hear a blow.
  if (!listening && message && flow.state === 'cake') {
    $('blow-button').textContent = content.micFallback || 'ແຕະບ່ອນນີ້ເພື່ອເປົ່າທຽນ';
    $('blow-button').hidden = false;
  }
}, text);

async function fetchText(path) {
  const response = await fetch(`${base}assets/${path}`);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.text();
}
async function loadLetter() {
  try {
    letterText = await fetchText('letter.txt');
    $('letter-content').textContent = letterText;
    $('retry-letter').hidden = true;
  } catch {
    $('letter-content').textContent = text('letterError');
    $('retry-letter').hidden = false;
  }
}
const photosPromise = fetch(`${base}assets/photos.json`).then(r => {
  if (!r.ok) throw new Error('Photo list unavailable'); return r.json();
}).then(items => { photos = items; }).catch(() => {
  $('gallery-grid').textContent = text('photosError');
});
const contentPromise = fetch(`${base}assets/content.json`).then(r => r.ok ? r.json() : {})
  .then(data => { content = { ...content, ...data }; }).catch(() => {})
  .then(() => { for (const el of document.querySelectorAll('[data-ui]')) { const value = content.ui?.[el.dataset.ui]?.trim(); if (value) el.textContent = value; } });
loadLetter();

async function ensureScene() {
  if (scene) return scene;
  if (scenePromise) return scenePromise;
  $('scene-status').hidden = false; $('scene-error').hidden = true;
  scenePromise = import('./scene.js').then(({ createBirthdayScene }) => createBirthdayScene($('scene-canvas'), openLetter))
    .then(result => {
      scene = result;
      $('scene-status').hidden = true;
      $('microphone-button').disabled = false;
      scene.setActive(flow.state === 'cake' || flow.state === 'reveal');
      return scene;
    }).catch(error => {
      console.error('Birthday scene could not load:', error);
      $('scene-status').hidden = true; $('scene-error').hidden = false;
      scenePromise = null;
      return null;
    });
  return scenePromise;
}

function showScreen(name) {
  for (const id of ['welcome', 'terminal', 'birthday']) {
    const visible = id === name;
    $(id).hidden = !visible;
    $(id).classList.toggle('scene-fade', visible);
  }
  document.body.dataset.scene = flow.state;
  document.querySelector('meta[name="theme-color"]').content = { welcome: '#f6eee4', terminal: '#201312' }[name] ?? '#241816';
  scene?.setActive(name === 'birthday');
}

const GREETING = 9, CONTINUE = lines.length - 1;
const cursor = Object.assign(document.createElement('span'), { className: 'terminal-cursor' });
function terminalLine(row, tag = 'div') {
  const line = document.createElement(tag);
  line.className = `terminal-line${row === GREETING ? ' greeting' : ''}`;
  const prompt = Object.assign(document.createElement('span'), { className: 'terminal-prompt', textContent: '>' });
  const text = Object.assign(document.createElement('span'), { className: 'terminal-text' });
  line.append(prompt, text);
  return line;
}
// Slow, readable pacing (~30 s in all): no skip; the last line becomes the way on.
function pauseAfter(row) {
  if (row === 3) return 1300;          // "checking today's date..." holds a beat
  if (row === GREETING - 1) return 1900; // breath before the birthday line
  if (row === GREETING) return 1400;
  return 720;
}
function charDelay(character) {
  if (/\s/.test(character)) return 70 + Math.random() * 40;
  if (/[.,']/.test(character)) return 140 + Math.random() * 80;
  return 58 + Math.random() * 46;
}
function startTyping() {
  typing = true; let row = 0, char = 0;
  $('terminal-output').replaceChildren();
  $('terminal-accessible').textContent = '';
  $('terminal').classList.remove('typed');
  function tick() {
    if (!typing || flow.state !== 'terminal') return;
    let line = $('terminal-output').lastElementChild;
    if (!char) {
      line?.classList.remove('current');
      line = terminalLine(row); line.classList.add('current');
      $('terminal-output').append(line);
      line.append(cursor);
    }
    const character = lines[row][char++];
    line.querySelector('.terminal-text').textContent += character;
    $('terminal').classList.add('keying');
    audio.tick(character);
    if (char >= lines[row].length) {
      $('terminal-accessible').textContent += `${lines[row]}\n`;
      $('terminal').classList.remove('keying');
      if (row === CONTINUE) { completeTyping(); return; }
      typeTimer = setTimeout(tick, pauseAfter(row++) * pace); char = 0;
    } else typeTimer = setTimeout(tick, charDelay(character) * pace);
  }
  // Let the dark settle and the cursor blink before the first keystroke.
  $('terminal-output').append(cursor);
  typeTimer = setTimeout(tick, 1100 * pace);
}
function completeTyping() {
  clearTimeout(typeTimer); typing = false;
  flow.send('TYPED');
  const last = $('terminal-output').lastElementChild;
  const button = terminalLine(CONTINUE, 'button');
  button.id = 'terminal-continue'; button.classList.add('current', 'terminal-continue');
  button.querySelector('.terminal-text').textContent = lines[CONTINUE];
  button.append(cursor);
  button.addEventListener('click', event => { event.stopPropagation(); enter(); });
  last.replaceWith(button);
  $('terminal').classList.add('typed');
  button.focus({ preventScroll: true });
}

// The cake room opens in the dark: candle first, then stars, then the table;
// the wish words and the microphone arrive once the room is lit.
async function openCakeRoom() {
  const run = journey;
  document.body.classList.add('cake-intro');
  showScreen('birthday'); $('birthday-title').focus({ preventScroll: true });
  const ready = await ensureScene();
  if (run !== journey || flow.state !== 'cake') return;
  await new Promise(resolve => ready ? ready.intro(resolve) : resolve());
  if (run !== journey) return;
  document.body.classList.remove('cake-intro');
}
async function enter() {
  if (transitioning || $('letter-dialog').open || $('photo-dialog').open) return;
  audio.enable(); music.enable();
  if (flow.state === 'welcome') {
    transitioning = true;
    document.body.classList.add('to-night');
    await wait(900);
    document.body.classList.remove('to-night');
    flow.send('ENTER'); showScreen('terminal'); startTyping(); ensureScene();
    $('terminal').focus({ preventScroll: true });
    transitioning = false;
  } else if (flow.state === 'terminal') {
    if (typing || !flow.send('ENTER')) return;
    // The song begins with this Enter; its first notes meet the candle.
    music.play();
    transitioning = true;
    $('terminal').classList.add('leaving');
    await wait(900);
    $('terminal').classList.remove('leaving');
    transitioning = false;
    openCakeRoom();
  }
}

function openPhoto(photo, number) {
  lastFocus = document.activeElement;
  const caption = content.captions?.[number]?.trim();
  const img = Object.assign(document.createElement('img'), { src: `${base}${photo.src}`, alt: caption || photo.alt, width: photo.width, height: photo.height, decoding: 'async' });
  $('photo-view').querySelector('img')?.remove();
  $('photo-view').prepend(img);
  $('photo-view-caption').textContent = caption || '';
  $('photo-view-caption').hidden = !caption;
  $('photo-dialog').showModal();
  $('close-photo').focus({ preventScroll: true });
}
function photoButton(photo, number, className) {
  const button = document.createElement('button');
  button.className = className; button.type = 'button';
  const caption = content.captions?.[number]?.trim();
  button.setAttribute('aria-label', caption ? `ເບິ່ງຮູບ: ${caption}` : `ເບິ່ງຮູບທີ ${number}`);
  const img = document.createElement('img'); img.src = `${base}${photo.src}`; img.alt = '';
  img.width = photo.width; img.height = photo.height; img.decoding = 'async';
  img.loading = className === 'polaroid' ? 'eager' : 'lazy';
  button.append(img);
  if (caption) button.append(Object.assign(document.createElement('span'), { className: 'photo-caption', textContent: caption }));
  button.addEventListener('click', () => openPhoto(photo, number));
  return button;
}

async function revealMemories(run) {
  await Promise.all([photosPromise, contentPromise]);
  if (run !== journey || flow.state !== 'reveal') return;
  const chosen = (content.revealPhotos || []).map(number => [photos[number - 1], number]).filter(([photo]) => photo).slice(0, 3);
  const box = $('polaroids'); box.hidden = false;
  if (!chosen.length) box.textContent = text('noPhotos');
  const cards = chosen.map(([photo, number], index) => {
    const card = photoButton(photo, number, 'polaroid pending');
    card.style.setProperty('--rotation', `${[-7, 2.5, 8][index]}deg`);
    card.style.setProperty('--delay', `${index * .8}s`);
    return card;
  });
  box.replaceChildren(...cards);
  // Decode first so no blank frame ever pops out of the cake.
  await Promise.all(cards.map(card => card.querySelector('img').decode().catch(() => {})));
  if (run !== journey) return;
  // Each picture pops out of the cake, then settles into its place in the row.
  const stage = $('birthday').getBoundingClientRect(), anchor = scene?.cakeAnchor();
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    const fromX = anchor ? anchor.x - (rect.left - stage.left + rect.width / 2) : 0;
    const fromY = anchor ? anchor.y - (rect.top - stage.top + rect.height / 2) : 80;
    card.style.setProperty('--from-x', `${fromX}px`); card.style.setProperty('--from-y', `${fromY}px`);
    card.classList.remove('pending');
  }
  await wait(Math.max(0, cards.length - 1) * 800 + 1500);
  if (run !== journey) return;
  showLetterHint();
}
// The hint sits beside the letter where the table is empty; on narrow screens,
// where every side of the letter touches the cake, it rests under the heading.
function positionLetterUI() {
  if (!scene || $('letter-hotspot').hidden) return;
  const anchor = scene.letterAnchor(), size = Math.min(130, Math.max(76, anchor.radius * 1.8));
  const hotspot = $('letter-hotspot');
  Object.assign(hotspot.style, { left: `${anchor.x}px`, top: `${anchor.y}px`, width: `${size}px`, height: `${size}px` });
  const hint = $('letter-hint');
  if (hint.hidden) return;
  const width = hint.offsetWidth, height = hint.offsetHeight, stage = $('birthday');
  const gap = size / 2 + 14, edge = 16;
  const clampTop = top => Math.min(Math.max(edge, top), stage.clientHeight - height - edge);
  let left, top, side;
  if (anchor.x + gap + width <= stage.clientWidth - edge) { side = 'right'; left = anchor.x + gap; top = clampTop(anchor.y - height / 2); }
  else if (anchor.x - gap - width >= edge) { side = 'left'; left = anchor.x - gap - width; top = clampTop(anchor.y - height / 2); }
  else {
    side = 'free'; left = (stage.clientWidth - width) / 2;
    top = $('birthday-title').getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 18;
  }
  Object.assign(hint.style, { left: `${left}px`, top: `${top}px` });
  hint.style.setProperty('--arrow-y', `${Math.min(Math.max(16, anchor.y - top), height - 16)}px`);
  hint.classList.remove('left', 'right', 'free', 'below');
  hint.classList.add(side);
}
function showLetterHint() {
  $('letter-hint-text').textContent = content.letterHint || 'ມີຈົດໝາຍຢູ່ເທິງໂຕະເດີ ແຕະທີ່ຈົດໝາຍເພື່ອອ່ານໄດ້ເລີຍ';
  $('letter-hint').hidden = false;
  if (scene) {
    scene.enableLetter(true);
    $('letter-hotspot').hidden = false;
    positionLetterUI();
  } else {
    // No 3D table to tap: the hint carries its own way to the letter.
    $('hint-open').hidden = false;
  }
}

function blow() {
  if (!flow.send('BLOW')) return;
  const run = journey;
  mic.stop(); music.duck(false); $('mic-status').textContent = ''; $('blow-button').hidden = true;
  document.body.dataset.scene = 'reveal'; $('wish-controls').hidden = true;
  scene?.blow();
  wait(1600).then(() => revealMemories(run));
}

function markLetterRead() {
  if (letterRead) return;
  letterRead = true;
  $('letter-gallery').hidden = false;
  $('after-letter').hidden = false;
  // Bring the new button into the open letter so it is never hidden below the sheet.
  if ($('letter-dialog').open) $('letter-gallery').scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'instant' : 'smooth' });
}
// The gallery unlocks once the letter's end has been reached (and stayed in
// view for a moment, so a short glance at an unscrolled letter does not count).
const letterEndObserver = new IntersectionObserver(entries => {
  clearTimeout(readTimer);
  if (!entries.some(entry => entry.isIntersecting)) return;
  const remaining = 2500 - (performance.now() - letterOpenedAt);
  if (remaining <= 0) markLetterRead();
  else readTimer = setTimeout(markLetterRead, remaining);
}, { root: $('letter-dialog') });
function openLetter() {
  if ($('letter-dialog').open) return;
  lastFocus = document.activeElement;
  if (!letterText && $('retry-letter').hidden) $('letter-content').textContent = text('letterLoading');
  $('letter-hint').hidden = true;
  $('letter-dialog').showModal(); $('letter-dialog').scrollTop = 0;
  letterOpenedAt = performance.now();
  letterEndObserver.observe($('letter-end'));
  $('close-letter').focus({ preventScroll: true });
}
function openGallery() {
  if (!$('gallery-grid').children.length) $('gallery-grid').replaceChildren(...photos.map((photo, i) => photoButton(photo, i + 1, 'gallery-photo')));
  $('gallery').hidden = false; $('gallery-title').focus({ preventScroll: true });
  $('gallery').scrollIntoView({ behavior: reduceMotion() ? 'instant' : 'smooth' });
}
function replay() {
  journey++;
  clearTimeout(typeTimer); clearTimeout(readTimer); mic.stop(); music.stop();
  flow.send('REPLAY'); scene?.reset();
  letterRead = false; transitioning = false;
  document.body.classList.remove('cake-intro');
  $('wish-controls').hidden = false; $('blow-button').hidden = true;
  for (const id of ['polaroids', 'letter-hint', 'letter-hotspot', 'hint-open', 'after-letter', 'letter-gallery', 'gallery']) $(id).hidden = true;
  $('polaroids').replaceChildren();
  $('mic-status').textContent = ''; $('microphone-button').disabled = !scene;
  $('microphone-button').setAttribute('aria-pressed', 'false');
  showScreen('welcome'); window.scrollTo({ top: 0, behavior: 'instant' }); $('enter-button').focus({ preventScroll: true });
}

function closeOnBackdrop(dialog) {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}

$('enter-button').addEventListener('click', enter);
// After the message is typed, a tap anywhere on the terminal continues too.
$('terminal').addEventListener('click', () => { if (!typing) enter(); });
$('blow-button').addEventListener('click', blow);
$('skip-scene').addEventListener('click', () => { $('scene-error').hidden = true; document.body.classList.remove('cake-intro'); blow(); });
$('retry-scene').addEventListener('click', () => { ensureScene().then(result => { if (result) openCakeRoom(); }); });
$('microphone-button').addEventListener('click', () => { $('blow-button').hidden = true; music.duck(true); mic.start(); });
$('replay-button').addEventListener('click', replay);
for (const id of ['letter-hotspot', 'hint-open', 'gallery-letter']) $(id).addEventListener('click', openLetter);
$('retry-letter').addEventListener('click', loadLetter);
$('close-letter').addEventListener('click', () => $('letter-dialog').close());
$('letter-dialog').addEventListener('close', () => { clearTimeout(readTimer); letterEndObserver.disconnect(); lastFocus?.focus({ preventScroll: true }); });
$('letter-gallery').addEventListener('click', () => { $('letter-dialog').close(); openGallery(); });
$('gallery-button').addEventListener('click', openGallery);
$('close-photo').addEventListener('click', () => $('photo-dialog').close());
$('photo-dialog').addEventListener('close', () => lastFocus?.focus({ preventScroll: true }));
closeOnBackdrop($('letter-dialog')); closeOnBackdrop($('photo-dialog'));
$('sound-toggle').addEventListener('click', () => {
  muted = !muted; audio.setMuted(muted); music.setMuted(muted); if (!muted) audio.enable();
  $('sound-toggle').setAttribute('aria-pressed', String(muted)); $('sound-toggle').setAttribute('aria-label', muted ? 'ເປີດສຽງ' : 'ປິດສຽງ');
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.repeat || event.target.closest('button,a,input,textarea,dialog')) return;
  event.preventDefault(); enter();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { mic.stop(); music.duck(false); music.pause(); $('microphone-button').disabled = !scene; $('mic-status').textContent = ''; }
  else music.resume();
});
window.addEventListener('resize', positionLetterUI);
window.addEventListener('pagehide', () => { mic.stop(); audio.dispose(); music.dispose(); scene?.dispose(); });

// Direct local preview of the table, while the gift itself starts at welcome.
if (new URLSearchParams(location.search).get('scene') === 'cake') {
  flow.send('ENTER'); flow.send('TYPED'); flow.send('ENTER'); openCakeRoom();
}
