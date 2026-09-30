export function createFlow() {
  let state = 'welcome';
  let typed = false;
  return {
    get state() { return state; },
    send(event) {
      if (event === 'REPLAY') { state = 'welcome'; typed = false; return true; }
      if (state === 'welcome' && event === 'ENTER') { state = 'terminal'; return true; }
      if (state === 'terminal' && event === 'TYPED') { typed = true; return true; }
      if (state === 'terminal' && typed && event === 'ENTER') { state = 'cake'; return true; }
      if (state === 'cake' && event === 'BLOW') { state = 'reveal'; return true; }
      return false;
    },
  };
}
