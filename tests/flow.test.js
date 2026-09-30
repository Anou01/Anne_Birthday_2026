import test from 'node:test';
import assert from 'node:assert/strict';

// Removing transition guards would allow double clicks to skip a scene or
// create duplicate reveals. These tests pin the visitor-visible progression.
const { createFlow } = await import('../src/flow.js').catch(() => ({ createFlow: null }));

test('the birthday follows welcome, terminal, cake, reveal in order', () => {
  assert.equal(typeof createFlow, 'function', 'birthday flow must exist');
  const flow = createFlow();
  assert.equal(flow.state, 'welcome');
  assert.equal(flow.send('BLOW'), false);
  assert.equal(flow.send('ENTER'), true);
  assert.equal(flow.state, 'terminal');
  assert.equal(flow.send('ENTER'), false, 'typing must finish first');
  flow.send('TYPED');
  flow.send('ENTER');
  assert.equal(flow.state, 'cake');
  flow.send('BLOW');
  assert.equal(flow.state, 'reveal');
  assert.equal(flow.send('BLOW'), false, 'cannot reveal twice');
});

test('replay resets typing and permits a new wish', () => {
  assert.equal(typeof createFlow, 'function', 'birthday flow must exist');
  const flow = createFlow();
  flow.send('ENTER'); flow.send('TYPED'); flow.send('ENTER'); flow.send('BLOW');
  flow.send('REPLAY');
  assert.equal(flow.state, 'welcome');
  flow.send('ENTER');
  assert.equal(flow.send('ENTER'), false);
  flow.send('TYPED'); flow.send('ENTER');
  assert.equal(flow.send('BLOW'), true);
});
