// Keystroke onsets (seconds) inside assets/audio/keys.mp3, measured from the
// user's music/Sound_keybord.mp3 with ffmpeg silencedetect. Each typed
// character plays one real keystroke slice, so the sound follows the text.
const ONSETS = [
  .076, .166, .293, .399, .448, .530, .771, .866, .954, 1.018, 1.100, 1.177,
  1.246, 1.323, 1.442, 1.570, 1.602, 1.766, 1.854, 1.985, 2.040, 2.113, 2.249,
  2.360, 2.449, 2.551, 2.611, 2.706, 2.798, 2.871, 2.900, 2.943, 3.010, 3.081,
  3.173, 3.314, 3.526, 3.604, 3.710, 3.802, 3.898, 3.970, 4.080, 4.154, 4.247,
  4.301, 4.388, 4.448, 4.538, 4.651, 4.767, 4.812, 4.993, 5.086, 5.152, 5.335,
  5.424, 5.527, 5.605, 5.689, 5.785, 5.858, 5.951, 6.172, 6.248, 6.337, 6.430,
  6.488, 6.650,
];

export function createKeyboardAudio(src) {
  let context, buffer, loading, muted = false, last = -1;
  function synth(now) {
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = 'triangle'; oscillator.frequency.value = 650 + Math.random() * 500;
    gain.gain.setValueAtTime(.028, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + .026);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(now); oscillator.stop(now + .03);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  return {
    async enable() {
      try {
        context ??= new (window.AudioContext || window.webkitAudioContext)();
        if (context.state === 'suspended') await context.resume();
        loading ??= fetch(src)
          .then(response => { if (!response.ok) throw new Error('Keyboard sound unavailable'); return response.arrayBuffer(); })
          .then(data => context.decodeAudioData(data))
          .then(decoded => { buffer = decoded; })
          .catch(() => { /* The synthesized click remains as a fallback. */ });
      } catch { /* Audio is an enhancement. */ }
    },
    setMuted(value) { muted = value; },
    tick(character = 'a') {
      if (muted || !context || context.state !== 'running' || document.hidden) return;
      const now = context.currentTime;
      if (!buffer) { synth(now); return; }
      let index;
      do index = Math.floor(Math.random() * ONSETS.length); while (index === last && ONSETS.length > 1);
      last = index;
      const start = Math.max(0, ONSETS[index] - .012);
      const next = ONSETS[index + 1] ?? buffer.duration;
      const duration = Math.max(.04, Math.min(.12, next - start - .006));
      const source = context.createBufferSource(), gain = context.createGain();
      source.buffer = buffer;
      source.playbackRate.value = .96 + Math.random() * .08;
      const level = /\s/.test(character) ? .45 : .85;
      gain.gain.setValueAtTime(level, now);
      gain.gain.setValueAtTime(level, now + duration * .7);
      gain.gain.linearRampToValueAtTime(0, now + duration);
      source.connect(gain); gain.connect(context.destination);
      source.start(now, start, duration);
      source.onended = () => { source.disconnect(); gain.disconnect(); };
    },
    dispose() { context?.close(); },
  };
}
