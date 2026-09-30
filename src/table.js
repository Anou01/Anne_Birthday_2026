import * as THREE from 'three';
import { woodTexture, linenTexture } from './materials.js';

export function createTable() {
  const table = new THREE.Group(); table.name = 'Original walnut birthday table';
  const wood = new THREE.MeshStandardMaterial({ map: woodTexture(), color:'#d9b697', roughness: 0.76, metalness: 0.01 });
  const darkWood = new THREE.MeshStandardMaterial({ color: '#4f3325', roughness: 0.5 });
  const brass = new THREE.MeshStandardMaterial({ color: '#bb8c50', roughness: 0.35, metalness: 0.7 });
  function lathe(name, points, material) {
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(points.map(([r,y]) => new THREE.Vector2(r,y)), 128), material);
    mesh.name = name; mesh.castShadow = true; mesh.receiveShadow = true; table.add(mesh); return mesh;
  }
  const top=lathe('Rounded solid wood tabletop', [[0,-0.21],[3.37,-0.21],[3.48,-0.18],[3.53,-0.10],[3.53,-0.04],[3.49,0],[0,0]], wood);
  const topPositions=top.geometry.getAttribute('position'),topUV=top.geometry.getAttribute('uv');
  for(let i=0;i<topPositions.count;i++)topUV.setXY(i,(topPositions.getX(i)+3.53)/7.06,(topPositions.getZ(i)+3.53)/7.06);
  lathe('Turned walnut pedestal', [[0,-2.6],[0.65,-2.6],[0.70,-2.48],[0.48,-2.29],[0.28,-1.98],[0.25,-1.05],[0.34,-0.61],[0.75,-0.3],[1.08,-0.22],[0,-0.22]], darkWood);
  lathe('Sculpted foot', [[0,-2.68],[1.21,-2.68],[1.31,-2.62],[1.28,-2.54],[0.94,-2.45],[0.62,-2.4],[0,-2.4]], wood);
  lathe('Fine brass rim', [[3.5,-0.142],[3.535,-0.13],[3.535,-0.115],[3.50,-0.106]], brass);
  lathe('Pedestal brass collar', [[0.274,-1.95],[0.279,-1.95],[0.279,-1.83],[0.27,-1.83]], brass);
  const linen = new THREE.MeshStandardMaterial({ map: linenTexture(), roughness: 1, side: THREE.DoubleSide });
  const mat = new THREE.Mesh(new THREE.CylinderGeometry(1.9,1.9,0.018,96), linen);
  mat.name = 'Ivory linen cake mat'; mat.position.set(-0.2,0.014,-0.05); mat.receiveShadow = true; table.add(mat);
  const stitch = new THREE.Mesh(new THREE.TorusGeometry(1.83,0.008,5,128), new THREE.MeshStandardMaterial({color:'#c7b090',roughness:1}));
  stitch.rotation.x = -Math.PI/2; stitch.position.copy(mat.position); stitch.position.y = 0.027; table.add(stitch);
  return table;
}
