import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://127.0.0.1:5173';
await mkdir('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const report = { checks: [], errors: [], warnings: [] };
const letter = await readFile('Bless.txt', 'utf8');
const visible = (page, selector) => page.locator(selector).isVisible();
try {
  for (const [name, viewport, touch] of [['desktop', { width: 1440, height: 1000 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', hasTouch: touch, isMobile: touch });
    const page = await context.newPage();
    page.on('pageerror', e => report.errors.push(`${name}: ${e.message}`));
    page.on('console', m => { if(m.type()==='error')report.errors.push(`${name}: ${m.text()}`); if(m.type()==='warning')report.warnings.push(`${name}: ${m.text()}`); });
    await page.goto(`${base}/?typing=fast`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.welcome-portrait img').evaluate(img => img.complete && img.naturalWidth > 0), true, 'portrait loaded');
    assert.equal(await page.locator('.dedication, .corner-note').count(), 0, 'header "for Ani." mark and "made with love" note removed');
    assert.equal(await page.locator('.site-header').evaluate(h => /for\s*ani/i.test(h.textContent)), false, 'no "for Ani" in the header');
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1), true, 'welcome fits one screen');
    await page.screenshot({ path: `.impeccable/review/${name}-welcome.png`, fullPage: true });

    await page.getByRole('button', { name: 'Enter', exact: true }).click();
    await page.waitForFunction(() => document.body.dataset.scene === 'terminal');
    assert.equal(await page.locator('#terminal button').count(), 0, 'no skip control while typing');
    await page.locator('#terminal-continue').waitFor({ timeout: 15000 });
    await page.screenshot({ path: `.impeccable/review/${name}-terminal.png`, fullPage: true });
    await page.locator('#terminal-continue').click();

    await page.waitForFunction(() => document.body.dataset.scene === 'cake' && !document.body.classList.contains('cake-intro'), { timeout: 30000 });
    await page.waitForFunction(() => !document.querySelector('#microphone-button').disabled, { timeout: 30000 });
    assert.equal(await page.locator('#scene-canvas canvas').count(), 1, '3D canvas created');
    assert.equal(await visible(page, '#scene-error'), false, 'models loaded');
    assert.match(await page.locator('#birthday-title').textContent(), /ສຸກສັນວັນເກີດເດີອານິ/);
    assert.equal(await visible(page, '#blow-button'), false, 'no blow button while the microphone may work');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'no horizontal overflow');
    await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });

    // Headless Chrome has no microphone: the backup appears only after that failure.
    await page.locator('#microphone-button').click();
    await page.locator('#blow-button').waitFor({ state: 'visible' });
    await page.locator('#blow-button').click();
    await page.waitForFunction(() => document.querySelectorAll('.polaroid:not(.pending)').length === 3);
    await page.locator('#letter-hint').waitFor({ state: 'visible' });
    assert.equal(await visible(page, '#letter-hotspot'), true, 'letter on the table is marked');
    assert.equal(await visible(page, '#after-letter'), false, 'gallery waits for the letter');
    await page.screenshot({ path: `.impeccable/review/${name}-reveal.png`, fullPage: true });

    await page.locator('.polaroid').first().click();
    await page.locator('#photo-dialog').waitFor({ state: 'visible' });
    await page.screenshot({ path: `.impeccable/review/${name}-photo.png` });
    await page.keyboard.press('Escape');

    await page.locator('#letter-hotspot').click();
    await page.locator('#letter-dialog').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#letter-content').textContent(), letter, 'original Lao letter preserved');
    assert.equal(await visible(page, '#letter-gallery'), false, 'no gallery before reading');
    await page.screenshot({ path: `.impeccable/review/${name}-letter.png` });
    await page.locator('#letter-dialog').evaluate(dialog => dialog.scrollTo(0, dialog.scrollHeight));
    await page.locator('#letter-gallery').waitFor({ state: 'visible', timeout: 6000 });
    await page.locator('#letter-gallery').click();
    await page.locator('#gallery').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.gallery-photo').count(), 13);
    await page.locator('#replay-button').click();
    assert.equal(await visible(page, '#welcome'), true);
    assert.equal(await visible(page, '#gallery'), false);
    report.checks.push(`${name}: portrait welcome, terminal, cake intro, Lao wish text, mic-only with backup after failure, 3 photos pop, photo viewer, letter hint + table hotspot, exact letter, gallery only after reading, replay, fit`);
    await context.close();
  }
  // Normal motion: slow typing that cannot be skipped, then the staged cake-room intro.
  const normal = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await normal.newPage();
  page.on('pageerror', e => report.errors.push(`normal: ${e.message}`));
  let typingStarted = Date.now(), musicStatus = null;
  page.on('response', r => { if (/birthday-piano\.mp3/.test(r.url())) musicStatus = r.status(); });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: '.impeccable/review/desktop-motion-welcome.png' });
  typingStarted = Date.now();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3200);
  assert.match(await page.locator('#terminal-output').textContent(), /booting/);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => document.body.dataset.scene), 'terminal', 'Enter cannot skip the typing');
  await page.locator('#terminal-continue').waitFor({ timeout: 45000 });
  report.checks.push(`normal pace: typing took about ${Math.round((Date.now() - typingStarted) / 1000)} s`);
  assert.equal(musicStatus, 200, 'birthday music fetched after the first Enter');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.body.dataset.scene === 'cake');
  await page.waitForTimeout(2100);
  await page.screenshot({ path: '.impeccable/review/desktop-intro-candle.png' });
  assert.equal(await page.evaluate(() => document.body.classList.contains('cake-intro')), true, 'words wait for the room');
  await page.waitForTimeout(2600);
  await page.screenshot({ path: '.impeccable/review/desktop-intro-stars.png' });
  await page.waitForFunction(() => !document.body.classList.contains('cake-intro'), { timeout: 15000 });
  await page.waitForTimeout(2300);
  await page.screenshot({ path: '.impeccable/review/desktop-intro-room.png' });
  await page.locator('#sound-toggle').click();
  assert.equal(await page.locator('#sound-toggle').getAttribute('aria-pressed'), 'true');
  await page.locator('#microphone-button').click();
  await page.locator('#blow-button').click();
  await page.waitForTimeout(1600 + 800 * 2 + 1500 + 900);
  await page.screenshot({ path: '.impeccable/review/desktop-motion-reveal.png' });
  report.checks.push('normal motion: birthday music loaded, no skip, staged intro (candle, stars, room), words after the room, mute, animated photo pop and letter hint');
  await normal.close();
  assert.deepEqual(report.errors, [], 'no browser errors');
} catch (error) {
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile('.impeccable/review/browser-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
