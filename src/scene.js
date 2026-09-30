import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { createTable } from './table.js';
import { glowTexture, sparkleTexture } from './materials.js';

const ASSETS = `${import.meta.env.BASE_URL}assets/models/`;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = value => Math.min(1, Math.max(0, value));
const smooth = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };
// Intro timeline (ms): the candle glows alone, stars gather, then the room lights up.
const INTRO = { flame: [300, 2000], stars: [2100, 4300], room: [4900, 8200] };

export async function createBirthdayScene(container, onLetter) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#241816');
  scene.fog = new THREE.Fog('#241816', 15, 32);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'ເຄັກວັນເກີດສີບົວ ແລະ ຈົດໝາຍ ຢູ່ເທິງໂຕະໄມ້ໃນແສງທຽນ');
  renderer.domElement.setAttribute('role', 'img');
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  const target = new THREE.Vector3(0,0.55,0);
  const hemi = new THREE.HemisphereLight('#ffe9dd','#61443b',2.0); scene.add(hemi);
  const key = new THREE.DirectionalLight('#ffdec1', 3.2);
  key.position.set(-3,7,4); key.castShadow = true;
  key.shadow.mapSize.set(2048,2048);
  Object.assign(key.shadow.camera, {left:-6,right:6,top:6,bottom:-6,near:0.5,far:20});
  key.shadow.bias = -0.0003; key.shadow.normalBias = 0.025;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight('#e8a4b4',1.4); fill.position.set(4,3,-4); scene.add(fill);
  const rim = new THREE.DirectionalLight('#fff2d8',1.2); rim.position.set(-4,2,-5); scene.add(rim);
  const roomLights = [[hemi, 2.0], [key, 3.2], [fill, 1.4], [rim, 1.2]];

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:'#30221e',roughness:0.94}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -2.7; floor.receiveShadow = true; scene.add(floor);
  scene.add(createTable());
  // A shallow porcelain plate catches a warm reflection below the supplied cake.
  const plate = new THREE.Mesh(new THREE.LatheGeometry([[0,0],[1.35,0],[1.50,.06],[1.53,.10],[1.48,.12],[1.32,.065],[0,.065]].map(p=>new THREE.Vector2(...p)),96),new THREE.MeshStandardMaterial({color:'#fff1df',roughness:0.25,metalness:0.05}));
  plate.position.set(-0.2,0.025,-0.05); plate.receiveShadow=true; plate.castShadow=true; scene.add(plate);
  const plateRing = new THREE.Mesh(new THREE.TorusGeometry(1.485,.009,6,128),new THREE.MeshStandardMaterial({color:'#cba774',metalness:.65,roughness:.3}));
  plateRing.rotation.x=-Math.PI/2; plateRing.position.set(-.2,.14,-.05); scene.add(plateRing);

  const manager = new THREE.LoadingManager();
  manager.setURLModifier(url => /PaperAndInk_Texture\.png/i.test(url) ? `${ASSETS}letter.png` : url);
  const texLoader = new THREE.TextureLoader(manager);
  let loaded;
  try {
    loaded = await Promise.all([
      new OBJLoader().loadAsync(`${ASSETS}cake.obj`),
      new FBXLoader(manager).loadAsync(`${ASSETS}letter.fbx`),
      texLoader.loadAsync(`${ASSETS}cake.png`),
      texLoader.loadAsync(`${ASSETS}letter.png`),
    ]);
  } catch (error) { renderer.dispose(); renderer.domElement.remove(); throw error; }
  const [cake, letter, cakeTexture, letterTexture] = loaded;
  cakeTexture.colorSpace = letterTexture.colorSpace = THREE.SRGBColorSpace;
  cakeTexture.anisotropy=letterTexture.anisotropy=8;
  const cakeMaterial = new THREE.MeshStandardMaterial({map:cakeTexture,roughness:.72,side:THREE.DoubleSide});
  // The supplied group includes multiple candles; replace only that decoration
  // with the user's requested single candle. Keep cake, cream and fruit meshes.
  const originalCandles = cake.getObjectByName('Candles');
  if(originalCandles) cake.remove(originalCandles);
  cake.traverse(o=>{if(o.isMesh){o.material=cakeMaterial;o.castShadow=true;o.receiveShadow=true;}});
  const box = new THREE.Box3().setFromObject(cake);
  const center=box.getCenter(new THREE.Vector3()), size=box.getSize(new THREE.Vector3());
  const scale=2.25/Math.max(size.x,size.z);
  cake.scale.setScalar(scale);
  cake.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
  const cakeRoot=new THREE.Group(); cakeRoot.position.set(-.2,.105,-.05); cakeRoot.add(cake); scene.add(cakeRoot);
  const cakeHeight=size.y*scale;

  // Normalize the supplied FBX without modifying its original source file.
  const letterMaterial = new THREE.MeshStandardMaterial({map:letterTexture,roughness:.92,side:THREE.DoubleSide,emissive:'#ffb98a',emissiveIntensity:0});
  letter.traverse(o=>{if(o.isMesh){o.material=letterMaterial;o.castShadow=true;o.receiveShadow=true;}});
  let letterBox=new THREE.Box3().setFromObject(letter), letterSize=letterBox.getSize(new THREE.Vector3());
  // FBX is normally Y-up; lay a flat writing set down if exported vertically.
  if(letterSize.y>letterSize.z*1.6 && letterSize.z<letterSize.x*.35) letter.rotation.x=-Math.PI/2;
  letter.updateMatrixWorld(true);
  letterBox.setFromObject(letter); letterSize=letterBox.getSize(new THREE.Vector3());
  const letterScale=1.48/Math.max(letterSize.x,letterSize.z);
  const letterCenter=letterBox.getCenter(new THREE.Vector3());
  const letterRoot=new THREE.Group(); letterRoot.name='Supplied letter model';
  letter.scale.multiplyScalar(letterScale);
  letter.position.set(-letterCenter.x*letterScale,-letterBox.min.y*letterScale,-letterCenter.z*letterScale);
  letterRoot.add(letter); letterRoot.rotation.y=-.35; letterRoot.position.set(2.03,.06,.60); scene.add(letterRoot);

  const candle = new THREE.Group(); candle.position.set(-.2,.105+cakeHeight-.06,-.05); scene.add(candle);
  const wax=new THREE.Mesh(new THREE.CylinderGeometry(.065,.07,.48,24),new THREE.MeshStandardMaterial({color:'#fff2de',roughness:.5}));
  wax.position.y=.24; wax.castShadow=true; candle.add(wax);
  const stripeCurve=new THREE.CatmullRomCurve3(Array.from({length:120},(_,i)=>{const t=i/119;return new THREE.Vector3(Math.cos(t*Math.PI*8)*.068,t*.46+.01,Math.sin(t*Math.PI*8)*.068);}));
  candle.add(new THREE.Mesh(new THREE.TubeGeometry(stripeCurve,120,.012,6,false),new THREE.MeshStandardMaterial({color:'#c9758d',roughness:.7})));
  const wick=new THREE.Mesh(new THREE.CylinderGeometry(.011,.011,.065,8),new THREE.MeshBasicMaterial({color:'#39231c'})); wick.position.y=.51; candle.add(wick);
  const flame=new THREE.Group(); flame.position.y=.52; candle.add(flame);
  const flameMaterial=new THREE.MeshBasicMaterial({color:'#ffbf55',transparent:true,opacity:.97,depthWrite:false});
  const flameMesh=new THREE.Mesh(new THREE.LatheGeometry([[0,0],[.046,.035],[.056,.10],[.039,.18],[.016,.24],[0,.29]].map(p=>new THREE.Vector2(...p)),24),flameMaterial); flame.add(flameMesh);
  const core=flameMesh.clone(); core.material=new THREE.MeshBasicMaterial({color:'#fff4bf',transparent:true}); core.scale.set(.55,.73,.55); flame.add(core);
  const glowMaterial=new THREE.SpriteMaterial({map:glowTexture(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});
  const glow=new THREE.Sprite(glowMaterial); glow.position.y=.12; glow.scale.set(1.3,1.3,1); flame.add(glow);
  const candleLight=new THREE.PointLight('#ffbd72',4,5,2); candleLight.position.y=.15; flame.add(candleLight);

  // A soft wisp rises from the wick once the flame is out.
  const smokeTexture=glowTexture();
  const smoke=Array.from({length:5},(_,i)=>{
    const puff=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeTexture,color:'#d9cfc8',transparent:true,opacity:0,depthWrite:false}));
    puff.position.set(0,.56,0); puff.userData.delay=i*.18; candle.add(puff); return puff;
  });

  // A handful of stars appear one by one and rise a little in the dark room
  // before the lights come up. They ride with the camera, behind the table.
  scene.add(camera);
  const sparkle=sparkleTexture();
  const stars=Array.from({length:12},(_,i)=>{
    const star=new THREE.Sprite(new THREE.SpriteMaterial({map:sparkle,color:i%3===1?'#ffd9e0':'#fff1d6',transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));
    const u=(i%2?1:-1)*(.18+Math.random()*.74), v=.2+Math.random()*.72;
    star.userData={u,v,depth:24+Math.random()*4,size:.55+Math.random()*.45,order:(i*7)%12/12,phase:Math.random()*6.28,level:0,rise:1};
    star.frustumCulled=false; camera.add(star); return star;
  });
  function placeStars(){
    const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    stars.forEach(star=>{
      const {u,v,depth,size,rise}=star.userData;
      star.position.set(u*depth*tan*camera.aspect,(v-.06*rise)*depth*tan,-depth);
      star.scale.setScalar(size*(.7+.3*(1-rise)));
    });
  }

  let active=false, lit=true, disposed=false, letterEnabled=false;
  let introStart=null, introDone=null, introLevel=0, blowStart=null;
  const sceneStarted=performance.now();
  const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2();
  function click(event){
    if(!active||!letterEnabled) return;
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    if(raycaster.intersectObject(letterRoot,true).length) onLetter();
  }
  renderer.domElement.addEventListener('click',click);

  // Everything but the flame starts dark; intro() brings the room up in stages.
  function applyIntro(elapsed){
    const flameIn=smooth((elapsed-INTRO.flame[0])/(INTRO.flame[1]-INTRO.flame[0]));
    const starsRaw=clamp01((elapsed-INTRO.stars[0])/(INTRO.stars[1]-INTRO.stars[0]));
    const roomIn=smooth((elapsed-INTRO.room[0])/(INTRO.room[1]-INTRO.room[0]));
    introLevel=roomIn;
    flameMaterial.opacity=.97*flameIn; core.material.opacity=flameIn; glowMaterial.opacity=flameIn;
    // Before the room lights, the candle glows softly so the flame leads.
    if(lit) candleLight.intensity=4*flameIn;
    // Until the room lights, the candle reaches only the top of the cake, and every
    // unlit surface melts into the room's own tone instead of rendering black.
    candleLight.distance=1.6+3.4*roomIn;
    roomLights.forEach(([light,base])=>{light.intensity=base*roomIn*(light===fill&&!lit?1.5:1);});
    const veil=1-roomIn;
    groundMaterials.forEach(([material,emissive,intensity])=>{
      if(veil>0){material.emissive.copy(GROUND);material.emissiveIntensity=GROUND_GAIN*veil;}
      else{material.emissive.copy(emissive);material.emissiveIntensity=intensity;}
    });
    renderer.toneMappingExposure=.55+.63*Math.max(roomIn,flameIn*.4);
    stars.forEach(star=>{const appear=smooth((starsRaw-star.userData.order*.7)/.3);star.userData.level=appear*(1-.5*roomIn);star.userData.rise=1-appear;});
    placeStars();
    return roomIn>=1;
  }
  const GROUND=new THREE.Color('#241816'), GROUND_GAIN=2.7; // calibrated so unlit surfaces render at the #241816 ground
  const groundMaterials=[];
  scene.traverse(o=>{if(o.isMesh&&o.material?.isMeshStandardMaterial&&!groundMaterials.some(([m])=>m===o.material))groundMaterials.push([o.material,o.material.emissive.clone(),o.material.emissiveIntensity]);});
  applyIntro(0);

  function resize(){
    const w=container.clientWidth,h=container.clientHeight;
    if(!w||!h) return;
    renderer.setSize(w,h); camera.aspect=w/h;
    const narrow=w/h<.8;
    camera.position.set(6.8,narrow?6.4:5.9,narrow?12.8:11.1);
    camera.fov=narrow?42:36;
    target.set(0,narrow?.65:.45,0); camera.lookAt(target);camera.updateProjectionMatrix();
    placeStars();
    render();
  }
  function render(){if(!disposed) renderer.render(scene,camera);}
  function animate(){
    if(!active||document.hidden||disposed) return;
    const now=performance.now(), t=(now-sceneStarted)/1000;
    if(introStart!==null){
      if(applyIntro(now-introStart)){introStart=null;const done=introDone;introDone=null;done?.();}
    }
    stars.forEach(star=>{star.material.opacity=star.userData.level*(reduced()?.9:.7+.3*Math.sin(t*1.9+star.userData.phase));});
    if(lit&&!reduced()){
      flame.scale.set(1+Math.sin(t*7)*.045,1+Math.sin(t*10)*.055,1);
      flame.rotation.z=Math.sin(t*5)*.065;
      if(introStart===null) candleLight.intensity=4+Math.sin(t*11)*.35;
    }
    if(blowStart!==null){
      const s=(now-blowStart)/1000, out=reduced()?1:clamp01(s/.35);
      flame.visible=out<1; flame.scale.setScalar(Math.max(.001,1-out)); candleLight.intensity=4*(1-out);
      fill.intensity=1.4*introLevel*(1+.5*out); hemi.intensity=2*introLevel*(1+.12*out);
      smoke.forEach(puff=>{
        const p=reduced()?1:clamp01((s-.25-puff.userData.delay)/2.6);
        puff.position.set(Math.sin(p*5+puff.userData.delay*9)*.05,.56+p*.9,0);
        puff.scale.setScalar(.08+p*.42); puff.material.opacity=p>0&&p<1?.3*Math.sin(p*Math.PI):0;
      });
      if(s>4) blowStart=null;
    }
    if(letterEnabled&&!reduced()) letterMaterial.emissiveIntensity=.12+.12*Math.sin(t*2.6);
    render();
  }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
  renderer.setAnimationLoop(animate);
  resize();

  const project=object=>{
    const box=new THREE.Box3().setFromObject(object), point=box.getCenter(new THREE.Vector3());
    const edge=point.clone().add(new THREE.Vector3(box.getSize(new THREE.Vector3()).x/2,0,0));
    point.project(camera); edge.project(camera);
    const w=container.clientWidth,h=container.clientHeight;
    const x=(point.x+1)/2*w, y=(1-point.y)/2*h;
    return {x,y,radius:Math.abs((edge.x+1)/2*w-x)};
  };
  return {
    setActive(value){active=value; if(value){resize();render();}},
    intro(onDone){
      if(reduced()){applyIntro(Infinity);render();onDone?.();return;}
      introDone=onDone; introStart=performance.now();
    },
    blow(){if(!lit)return;lit=false;blowStart=performance.now();},
    enableLetter(value){letterEnabled=value;if(!value)letterMaterial.emissiveIntensity=0;else if(reduced())letterMaterial.emissiveIntensity=.18;render();},
    letterAnchor(){return project(letterRoot);},
    cakeAnchor(){return project(cakeRoot);},
    reset(){
      lit=true;blowStart=null;introStart=null;introDone=null;letterEnabled=false;letterMaterial.emissiveIntensity=0;
      flame.visible=true;flame.scale.setScalar(1);smoke.forEach(p=>{p.material.opacity=0;});
      applyIntro(0);render();
    },
    dispose(){disposed=true;renderer.setAnimationLoop(null);resizeObserver.disconnect();renderer.domElement.removeEventListener('click',click);scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [o.material].flat()){m.map?.dispose();m.dispose();}}});renderer.dispose();renderer.domElement.remove();},
  };
}
