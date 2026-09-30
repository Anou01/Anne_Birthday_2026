import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] });
const checks = [];
try {
  const context = await browser.newContext({ viewport:{width:320,height:640}, reducedMotion:'reduce' });
  const page = await context.newPage();
  await page.route('**/assets/models/cake.obj', route => route.abort());
  await page.goto(`${base}/?scene=cake`, {waitUntil:'networkidle'});
  await page.locator('#scene-error').waitFor();
  await page.locator('#skip-scene').click();
  await page.locator('#hint-open').waitFor();
  assert.equal(await page.locator('.polaroid').count(),3);
  await page.locator('#hint-open').click();
  assert.ok((await page.locator('#letter-content').textContent()).length>100);
  checks.push('Missing cake asset: error with recovery, memories and original letter remain usable at 320px.');
  await context.close();

  const retry = await browser.newContext({ viewport:{width:390,height:844}, reducedMotion:'reduce' });
  const p = await retry.newPage();
  await p.route('**/assets/letter.txt', route=>route.abort());
  await p.goto(`${base}/?scene=cake`, {waitUntil:'networkidle'});
  await p.waitForFunction(()=>!document.querySelector('#microphone-button').disabled);
  await p.locator('#microphone-button').click();
  await p.locator('#blow-button').waitFor({state:'visible'});
  await p.locator('#blow-button').click();
  await p.locator('#letter-hotspot').click();
  await p.locator('#retry-letter').waitFor();
  await p.unroute('**/assets/letter.txt');
  await p.locator('#retry-letter').click();
  await p.waitForFunction(()=>document.querySelector('#retry-letter').hidden);
  assert.ok((await p.locator('#letter-content').textContent()).length>100);
  checks.push('Missing letter: visible retry restores original Lao text without losing the scene.');
  await p.keyboard.press('Escape');
  const typography = await p.evaluate(()=>({heading:getComputedStyle(document.querySelector('.wish-name')).fontSize,body:getComputedStyle(document.querySelector('.wish-prompt')).fontSize}));
  assert.ok(parseFloat(typography.heading)/parseFloat(typography.body)>1.25);
  checks.push(`Computed mobile typography: Lao heading ${typography.heading}, wish prompt ${typography.body}; detector's all-16px warning is a false positive.`);
  await retry.close();
  console.log(JSON.stringify({checks},null,2));
  await writeFile('.impeccable/review/fallback-report.json',JSON.stringify({checks},null,2));
} finally { await browser.close(); }
