// The birthday piano from music/soulprodmusic-happy-birthday-piano-508359.mp3.
// It starts when the terminal gives way to the candle and loops without the
// file's silent tail, so it can stay while she reads the letter.
const LOOP_START = .45, LOOP_END = 43.4, LEVEL = .7, DUCKED = .16;

export function createMusic(src) {
  let context, buffer, loading, source, gain, muted = false, wanted = false, ducked = false;
  const level = () => muted ? 0 : LEVEL * (ducked ? DUCKED : 1);
  function rampTo(value, seconds) {
    if (!gain) return;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(value, now + seconds);
  }
  function start() {
    if (source || !buffer || !wanted) return;
    source = context.createBufferSource(); gain = context.createGain();
    Object.assign(source, { buffer, loop: true, loopStart: LOOP_START, loopEnd: LOOP_END });
    gain.gain.setValueAtTime(0, context.currentTime);
    source.connect(gain); gain.connect(context.destination);
    source.start(context.currentTime, 0);
    rampTo(level(), 2.4);
  }
  return {
    // Called from the first Enter (a user gesture) so the file is ready later.
    async enable() {
      try {
        // Let the song play even when an iPhone's ring/silent switch is on.
        if (navigator.audioSession && navigator.audioSession.type !== 'play-and-record') navigator.audioSession.type = 'playback';
        context ??= new (window.AudioContext || window.webkitAudioContext)();
        if (context.state === 'suspended') await context.resume();
        loading ??= fetch(src)
          .then(response => { if (!response.ok) throw new Error('Birthday music unavailable'); return response.arrayBuffer(); })
          .then(data => context.decodeAudioData(data))
          .then(decoded => { buffer = decoded; start(); })
          .catch(() => { /* The gift works without music. */ });
      } catch { /* Audio is an enhancement. */ }
    },
    play() { wanted = true; if (context?.state === 'suspended') context.resume(); start(); },
    stop(seconds = 1.2) {
      wanted = false;
      if (!source) return;
      rampTo(0, seconds);
      const old = source; source = null;
      old.stop(context.currentTime + seconds + .05);
      old.onended = () => old.disconnect();
    },
    // Softer while the microphone listens, so the song is not mistaken for a blow.
    duck(value) { ducked = value; rampTo(level(), value ? .5 : 1.6); },
    setMuted(value) { muted = value; rampTo(level(), .35); },
    pause() { context?.suspend(); },
    resume() { if (wanted) context?.resume(); },
    dispose() { context?.close(); },
  };
}
