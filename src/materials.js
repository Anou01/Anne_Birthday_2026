import * as THREE from 'three';

export function woodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#715039';
  ctx.fillRect(0, 0, 1024, 1024);
  // Long, irregular grain belongs to the wood, rather than a UI texture overlay.
  for (let y = 0; y < 1024; y += 1.2) {
    const shade = Math.sin(y * 0.056) * 11 + Math.sin(y * 0.73) * 4;
    ctx.strokeStyle = `rgba(${42 + shade}, ${22 + shade}, 14, ${0.09 + (Math.sin(y * 3.7) + 1) * 0.06})`;
    ctx.lineWidth = 0.7 + (Math.sin(y * 0.13) + 1) * 0.7;
    ctx.beginPath();
    for (let x = 0; x <= 1024; x += 12) {
      const bend = Math.sin(x * 0.006 + y * 0.014) * 7 + Math.sin(x * 0.018 + y * 0.006) * 2;
      if (!x) ctx.moveTo(x, y + bend); else ctx.lineTo(x, y + bend);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function linenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e7d6bb'; ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 128; i += 4) {
    ctx.fillStyle = 'rgba(255,250,235,.14)'; ctx.fillRect(i, 0, 1, 128);
    ctx.fillStyle = 'rgba(95,65,40,.08)'; ctx.fillRect(0, i, 128, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
}

export function glowTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 1, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,238,176,.9)');
  gradient.addColorStop(0.17, 'rgba(255,173,78,.25)');
  gradient.addColorStop(1, 'rgba(255,133,52,0)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

// A small four-point star: a soft core with fine light rays.
export function sparkleTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const core = ctx.createRadialGradient(64, 64, 0, 64, 64, 30);
  core.addColorStop(0, 'rgba(255,250,236,1)'); core.addColorStop(.25, 'rgba(255,236,200,.55)'); core.addColorStop(1, 'rgba(255,220,170,0)');
  ctx.fillStyle = core; ctx.fillRect(0, 0, 128, 128);
  for (const [w, h] of [[2.2, 120], [120, 2.2]]) {
    const ray = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    ray.addColorStop(0, 'rgba(255,248,228,.95)'); ray.addColorStop(1, 'rgba(255,248,228,0)');
    ctx.fillStyle = ray; ctx.fillRect(64 - w / 2, 64 - h / 2, w, h);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
