// Status lines are looked up by key so the words can come from content.json.
export function createMicrophone(onBlow, onStatus, text = key => key) {
  let stream, context, frame, timeout, generation = 0;
  function stop() {
    if (navigator.audioSession?.type === 'play-and-record') navigator.audioSession.type = 'playback';
    generation++; cancelAnimationFrame(frame); clearTimeout(timeout);
    stream?.getTracks().forEach(track => track.stop()); stream = null;
    context?.close(); context = null;
  }
  async function start() {
    stop(); const current = generation;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      onStatus(text('micUnsupported'), false); return;
    }
    onStatus(text('micRequesting'), true);
    // iPhone: recording needs the play-and-record session while the song plays.
    if (navigator.audioSession) navigator.audioSession.type = 'play-and-record';
    try {
      const acquired = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      if (generation !== current) { acquired.getTracks().forEach(t => t.stop()); return; }
      stream = acquired;
      context = new (window.AudioContext || window.webkitAudioContext)();
      await context.resume();
      if (generation !== current) return;
      const analyser = context.createAnalyser(); analyser.fftSize = 1024;
      context.createMediaStreamSource(stream).connect(analyser);
      const values = new Float32Array(analyser.fftSize);
      const started = performance.now(); let baseline = .015, highSince = 0;
      onStatus(text('micListening'), true);
      timeout = setTimeout(() => { stop(); onStatus(text('micNotHeard'), false); }, 16000);
      function sample() {
        if (generation !== current) return;
        analyser.getFloatTimeDomainData(values);
        const rms = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0) / values.length);
        const now = performance.now();
        if (now - started < 650) baseline = baseline * .9 + rms * .1;
        else if (rms > Math.max(.055, baseline * 2.8)) {
          highSince ||= now;
          if (now - highSince > 220) { stop(); onStatus('', false); onBlow(); return; }
        } else highSince = 0;
        frame = requestAnimationFrame(sample);
      }
      sample();
    } catch {
      if (generation !== current) return;
      stop(); onStatus(text('micDenied'), false);
    }
  }
  return { start, stop };
}
