import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const floors = [
  { id:'roof', number:18, name:'頂樓觀景台', eyebrow:'ROOFTOP · OBSERVATORY', color:'#f0d38c', description:'登上 Orbit 的最高點，俯瞰品牌旅程與營運全貌。以策略視角發現下一個成長方向。', tags:['360° 導覽','策略視野','品牌發表'] },
  { id:'gallery', number:17, name:'品牌展館', eyebrow:'SIGNATURE · BRAND PAVILION', color:'#c69cff', description:'為產品與服務打造沉浸式的品牌展示空間。以立體展品、內容與互動敘事，讓每個亮點更有記憶點。', tags:['3D 展示','品牌體驗','沉浸敘事'] },
  { id:'expo', number:16, name:'科技展覽大廳', eyebrow:'EXHIBITION · EXPERIENCE HALL', color:'#ffad78', description:'整合產品示範、科技藝廊與互動導覽，讓訪客在同一個數位場域看見完整解決方案。', tags:['互動展演','產品導覽','科技藝廊'] },
  { id:'enterprise', number:15, name:'B2B 企業總部', eyebrow:'ENTERPRISE · B2B HUB', color:'#70d7c0', description:'企業合作與數位服務的共同入口。由品牌展示延伸至業務洽談、客戶服務與營運協作。', tags:['企業合作','客戶服務','營運協作'] },
  { id:'content', number:14, name:'AI 內容工廠', eyebrow:'CONTENT · AI STUDIO', color:'#f19ad1', description:'以 AI 協助內容企劃、多語製作與搜尋體驗，持續產出符合品牌語氣的數位內容。', tags:['AI 內容','SEO / GEO','多語支援'] },
  { id:'growth', number:13, name:'商務成長中心', eyebrow:'GROWTH · BUSINESS ENGINE', color:'#f6b65f', description:'串連商機接待、客戶洞察與成效追蹤，讓網站體驗和業務成長走在同一條軌道上。', tags:['AI 接待','商機管理','成效洞察'] },
  { id:'cloud', number:12, name:'雲端營運中樞', eyebrow:'CLOUD · OPERATIONS', color:'#84bfff', description:'把內容、品牌與數位服務收進一個隨時可存取的雲端工作空間，支援跨團隊協作。', tags:['雲端服務','整合管理','即時協作'] },
  { id:'core', number:11, name:'AI 晶體核心', eyebrow:'AI CORE · INTELLIGENCE ENGINE', color:'#7ef0c3', description:'Orbit Tower 的數位中樞，象徵 AI 能力、資料洞察與創意能量交會的起點。', tags:['AI 整合','智慧洞察','數位底座'] }
];
const $ = (selector) => document.querySelector(selector);
const canvas = $('#tower-canvas');
const stage = $('#tower-scene');
let renderer, scene, camera, controls, productRenderer, productScene, productCamera, productControls;
let currentMode = 'spatial';
let selectedFloor = null;
let hoveredFloor = null;
let isAutoRotating = true;
let lastTime = 0;
const clickable = [];
const floorGroups = new Map();
const movers = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const baseCamera = new THREE.Vector3(12.8, 9.2, 17.5);
const baseTarget = new THREE.Vector3(0, 3.9, 0);
const desiredCamera = baseCamera.clone();
const desiredTarget = baseTarget.clone();

function makeMaterial(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({color, metalness:0.56, roughness:0.24, clearcoat:1, clearcoatRoughness:0.16, ...options});
}
function addEdgeMesh(parent, geometry, color, opacity = .52) {
  const line = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({color, transparent:true, opacity}));
  parent.add(line);
  return line;
}
function addLabel(text, color) {
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 512; labelCanvas.height = 128;
  const ctx = labelCanvas.getContext('2d');
  ctx.clearRect(0,0,512,128);
  ctx.fillStyle = 'rgba(4,15,12,.75)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(13,20,486,88,10); ctx.fill(); ctx.stroke();
  ctx.font = '500 26px "DM Mono", monospace'; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(),256,65);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false});
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.35,.59,1);
  return sprite;
}
function makeCrystal(parent, color, size, y, rotation = 0) {
  const geo = new THREE.OctahedronGeometry(size,0);
  const material = makeMaterial(color,{metalness:.38,roughness:.12,transparent:true,opacity:.86,emissive:color,emissiveIntensity:.32,clearcoat:1});
  const crystal = new THREE.Mesh(geo,material);
  crystal.position.set(0,y,0); crystal.rotation.y=rotation; crystal.rotation.x=.28;
  parent.add(crystal);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color,transparent:true,opacity:.92}));
  crystal.add(edges);
  movers.push({mesh:crystal,baseY:y,phase:Math.random()*Math.PI*2,spin:.28+Math.random()*.2});
  return crystal;
}
function addFloor(index, data) {
  const y = .65 + index * 1.08;
  const width = 3.5 + (index % 2) * .48;
  const depth = 3.3 + ((index+1) % 2) * .42;
  const group = new THREE.Group();
  group.position.y = y;
  group.userData.floor = data;
  scene.add(group);
  floorGroups.set(data.id,group);
  const slabGeo = new THREE.BoxGeometry(width,.8,depth);
  const slab = new THREE.Mesh(slabGeo,makeMaterial(data.color,{transparent:true,opacity:.28,roughness:.13,metalness:.72,emissive:data.color,emissiveIntensity:.055,side:THREE.DoubleSide}));
  slab.userData.floorId=data.id;
  slab.castShadow=true; slab.receiveShadow=true;
  group.add(slab); clickable.push(slab);
  addEdgeMesh(group,slabGeo,data.color,.7);
  const floorLine = new THREE.Mesh(new THREE.BoxGeometry(width+.1,.035,depth+.1),new THREE.MeshBasicMaterial({color:data.color,transparent:true,opacity:.78}));
  floorLine.position.y=-.42; group.add(floorLine);
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(width-.13,.05,depth-.13),makeMaterial('#11241e',{transparent:true,opacity:.46,metalness:.62,roughness:.18}));
  ceiling.position.y=.42; group.add(ceiling);
  // Four dimensional glass façades with mullions: this is a volume, not a flat-card building.
  const glassMat=makeMaterial(data.color,{transparent:true,opacity:.22,metalness:.75,roughness:.12,side:THREE.DoubleSide,emissive:data.color,emissiveIntensity:.025});
  const front=new THREE.Mesh(new THREE.BoxGeometry(width-.12,.67,.035),glassMat); front.position.set(0,0,depth/2-.02); group.add(front);
  const back=front.clone(); back.position.z=-depth/2+.02; group.add(back);
  const sideGeo=new THREE.BoxGeometry(.035,.67,depth-.12);
  const left=new THREE.Mesh(sideGeo,glassMat); left.position.x=-width/2+.02; group.add(left);
  const right=left.clone(); right.position.x=width/2-.02; group.add(right);
  const mullionMat=new THREE.MeshBasicMaterial({color:data.color,transparent:true,opacity:.45});
  for(let j=-2;j<=2;j++){
    if(j===0) continue;
    const mullion=new THREE.Mesh(new THREE.BoxGeometry(.018,.67,.045),mullionMat); mullion.position.set(j*width/6,0,depth/2); group.add(mullion);
    const mullion2=new THREE.Mesh(new THREE.BoxGeometry(.045,.67,.018),mullionMat); mullion2.position.set(width/2,0,j*depth/6); group.add(mullion2);
  }
  const cornerMat=new THREE.MeshStandardMaterial({color:'#c5ffdf',metalness:.75,roughness:.19,emissive:data.color,emissiveIntensity:.2});
  for(const sx of [-1,1]) for(const sz of [-1,1]) { const post=new THREE.Mesh(new THREE.BoxGeometry(.055,.88,.055),cornerMat); post.position.set(sx*(width/2-.03),0,sz*(depth/2-.03)); group.add(post); }
  // Individually colored, animated volumetric crystal exhibit on each floor.
  const gem=makeCrystal(group,data.color,.3+(index%3)*.035,-.03,index*.31);
  gem.position.x=index%2===0?.12:-.12;
  const plinth=new THREE.Mesh(new THREE.CylinderGeometry(.56,.68,.12,32),makeMaterial('#12241e',{metalness:.85,roughness:.2,emissive:data.color,emissiveIntensity:.09}));
  plinth.position.y=-.46; group.add(plinth);
  const plinthRing=new THREE.Mesh(new THREE.TorusGeometry(.59,.015,8,48),new THREE.MeshBasicMaterial({color:data.color,transparent:true,opacity:.88}));
  plinthRing.rotation.x=Math.PI/2; plinthRing.position.y=-.38; group.add(plinthRing);
  const label=addLabel(`F${data.number} · ${data.name}`,data.color); label.position.set(0,.63,depth/2+.12); group.add(label);
  // distinct animated window lights
  for(let k=0;k<5;k++){
    const windowMat=new THREE.MeshBasicMaterial({color:data.color,transparent:true,opacity:.34+Math.random()*.3});
    const light=new THREE.Mesh(new THREE.PlaneGeometry(.22,.07),windowMat);
    light.position.set((k-2)*width/6,-.13,depth/2+.003); group.add(light);
  }
  return group;
}
function addArchitecture() {
  // Structural central lift spine
  const spine=new THREE.Mesh(new THREE.CylinderGeometry(.31,.41,9.55,10,1,true),makeMaterial('#1a4838',{transparent:true,opacity:.28,metalness:.85,roughness:.14,emissive:'#68d6a8',emissiveIntensity:.15,side:THREE.DoubleSide}));
  spine.position.y=4.15; scene.add(spine);
  const spineEdges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CylinderGeometry(.32,.42,9.55,8,1,true)),new THREE.LineBasicMaterial({color:'#81eac0',transparent:true,opacity:.58}));
  spineEdges.position.copy(spine.position); scene.add(spineEdges);
  // Four long metallic corner masts tie all independently selectable floors together.
  const mastMat=makeMaterial('#416f5f',{metalness:.9,roughness:.22,emissive:'#164738',emissiveIntensity:.2});
  for(const x of [-1,1]) for(const z of [-1,1]){const mast=new THREE.Mesh(new THREE.CylinderGeometry(.035,.055,9.4,8),mastMat);mast.position.set(x*2.08,4.12,z*2.02);scene.add(mast);}
  // Crown observation deck and antenna
  const crown=new THREE.Group(); crown.position.y=9.35; scene.add(crown);
  const crownDisk=new THREE.Mesh(new THREE.CylinderGeometry(2.28,1.85,.22,48),makeMaterial('#213d32',{metalness:.82,roughness:.18,emissive:'#e7cd8a',emissiveIntensity:.09})); crown.add(crownDisk);
  const crownRing=new THREE.Mesh(new THREE.TorusGeometry(2.12,.026,10,96),new THREE.MeshBasicMaterial({color:'#f0d38c',transparent:true,opacity:.92})); crownRing.rotation.x=Math.PI/2;crownRing.position.y=.14;crown.add(crownRing);
  const needle=new THREE.Mesh(new THREE.CylinderGeometry(.01,.035,1.65,8),new THREE.MeshBasicMaterial({color:'#afffe0'}));needle.position.y=1; crown.add(needle);
  const crownGem=makeCrystal(crown,'#f0d38c',.35,.37,.45);
  crownGem.position.y=.5;
  // podium, light wells, and three-dimensional neon ground rings
  const podium=new THREE.Mesh(new THREE.CylinderGeometry(2.35,2.7,.24,48),makeMaterial('#10231c',{metalness:.9,roughness:.18,emissive:'#3dbb87',emissiveIntensity:.15}));podium.position.y=.02;scene.add(podium);
  for(let i=0;i<4;i++){
    const r=2.7+i*.43;
    const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012+(i===0?.012:0),8,120),new THREE.MeshBasicMaterial({color:i%2?'#4cbd91':'#86f6c0',transparent:true,opacity:.42-i*.055}));ring.rotation.x=Math.PI/2;ring.position.y=-.11-i*.016;scene.add(ring);movers.push({mesh:ring,ring:true,spin:(i%2?-.035:.035)});
  }
  const ground=new THREE.Mesh(new THREE.CircleGeometry(20,72),new THREE.MeshBasicMaterial({color:'#10221c',transparent:true,opacity:.68}));ground.rotation.x=-Math.PI/2;ground.position.y=-.17;scene.add(ground);
  const grid=new THREE.GridHelper(38,48,'#1c503e','#17352c');grid.position.y=-.155;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
  // A softly lit halo anchors the tower in its scene.
  const halo=new THREE.PointLight('#74ffd0',44,18,2);halo.position.set(0,1,.4);scene.add(halo);
  const columnLight=new THREE.SpotLight('#5de6ad',88,20,Math.PI/8,.8,1.2);columnLight.position.set(0,1,3);columnLight.target.position.set(0,7,0);scene.add(columnLight,columnLight.target);
}
function createStarfield() {
  const count=1900, positions=new Float32Array(count*3), sizes=new Float32Array(count);
  for(let i=0;i<count;i++){
    const radius=14+Math.random()*26, phi=Math.random()*Math.PI*2, theta=Math.acos(2*Math.random()-1);
    positions[i*3]=radius*Math.sin(theta)*Math.cos(phi);
    positions[i*3+1]=Math.max(-2,radius*Math.cos(theta)+6);
    positions[i*3+2]=radius*Math.sin(theta)*Math.sin(phi);
    sizes[i]=Math.random();
  }
  const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(positions,3));geo.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
  const material=new THREE.PointsMaterial({color:'#b5f5db',size:.035,transparent:true,opacity:.72,depthWrite:false,sizeAttenuation:true});
  const stars=new THREE.Points(geo,material);scene.add(stars);movers.push({mesh:stars,starfield:true,spin:.006});
}
function setupScene() {
  try { renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'}); }
  catch(error){ $('#webgl-warning').hidden=false; $('#loading-screen').classList.add('is-hidden'); console.error('WebGL initialization failed',error); return false; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.18;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene(); scene.background=null; scene.fog=new THREE.FogExp2('#07100f',.021);
  camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.copy(baseCamera);
  controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.065;controls.enablePan=false;controls.minDistance=9;controls.maxDistance=29;controls.minPolarAngle=.35;controls.maxPolarAngle=1.52;controls.target.copy(baseTarget);controls.autoRotate=true;controls.autoRotateSpeed=.42;controls.rotateSpeed=.62;controls.zoomSpeed=.75;
  scene.add(new THREE.HemisphereLight('#baf2d8','#07110e',2.1));
  const key=new THREE.DirectionalLight('#edffed',3.1);key.position.set(7,13,9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const rim=new THREE.DirectionalLight('#54dca7',2.5);rim.position.set(-8,8,-8);scene.add(rim);
  const blue=new THREE.PointLight('#95caff',13,22,2);blue.position.set(-7,8,4);scene.add(blue);
  createStarfield();addArchitecture();floors.slice().reverse().forEach((floor,index)=>addFloor(index,floor));
  const width=stage.clientWidth||innerWidth,height=stage.clientHeight||innerHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
  return true;
}
function createProductViewer(floor) {
  const productCanvas=$('#product-canvas');
  if(!productCanvas) return;
  if(!productRenderer){
    try { productRenderer=new THREE.WebGLRenderer({canvas:productCanvas,antialias:true,alpha:true,powerPreference:'low-power'}); }
    catch { return; }
    productRenderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));productRenderer.outputColorSpace=THREE.SRGBColorSpace;productRenderer.toneMapping=THREE.ACESFilmicToneMapping;productRenderer.toneMappingExposure=1.15;
    productScene=new THREE.Scene();productScene.background=null;
    productCamera=new THREE.PerspectiveCamera(32,1,.1,20);productCamera.position.set(3.2,2.1,4.5);
    productControls=new OrbitControls(productCamera,productCanvas);productControls.enableDamping=true;productControls.dampingFactor=.08;productControls.enablePan=false;productControls.minDistance=3;productControls.maxDistance=7;productControls.autoRotate=true;productControls.autoRotateSpeed=1.4;
    productScene.add(new THREE.HemisphereLight('#e6ffef','#07110e',2));const key=new THREE.DirectionalLight('#f7fff5',4);key.position.set(3,5,5);productScene.add(key);
    const rim=new THREE.PointLight('#73ffcb',17,10);rim.position.set(-3,1,-2);productScene.add(rim);
    const base=new THREE.Mesh(new THREE.CylinderGeometry(.86,.95,.12,48),makeMaterial('#1e392e',{metalness:.87,roughness:.17}));base.position.y=-.85;productScene.add(base);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.78,.018,8,60),new THREE.MeshBasicMaterial({color:'#85ffca',transparent:true,opacity:.86}));ring.rotation.x=Math.PI/2;ring.position.y=-.77;productScene.add(ring);
    const particleGeometry=new THREE.BufferGeometry();const points=[];for(let i=0;i<75;i++){const a=Math.random()*Math.PI*2,r=.55+Math.random()*1.3;points.push(Math.cos(a)*r,(Math.random()-.5)*2.5,Math.sin(a)*r)}particleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));productScene.add(new THREE.Points(particleGeometry,new THREE.PointsMaterial({color:'#d5ffea',size:.027,transparent:true,opacity:.75})));
    window.addEventListener('resize',resizeProduct);
  }
  // Rebuild the exhibit as a material-specific 3D crystal, never a flat thumbnail.
  const old=productScene.getObjectByName('product-gem');if(old){productScene.remove(old);old.traverse(child=>{child.geometry?.dispose();if(child.material){Array.isArray(child.material)?child.material.forEach(m=>m.dispose()):child.material.dispose()}})}
  const gemGroup=new THREE.Group();gemGroup.name='product-gem';
  const crystalGeometry=new THREE.OctahedronGeometry(.72,1);
  const crystal= new THREE.Mesh(crystalGeometry,makeMaterial(floor.color,{metalness:.34,roughness:.1,transparent:true,opacity:.87,emissive:floor.color,emissiveIntensity:.33,clearcoat:1}));gemGroup.add(crystal);
  const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(.9,0)),new THREE.LineBasicMaterial({color:floor.color,transparent:true,opacity:.85}));wire.rotation.set(.08,.25,.12);gemGroup.add(wire);
  const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(.21,1),new THREE.MeshStandardMaterial({color:'#eafff5',emissive:floor.color,emissiveIntensity:1.4,metalness:.15,roughness:.16}));gemGroup.add(inner);
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.02,.009,8,100),new THREE.MeshBasicMaterial({color:floor.color,transparent:true,opacity:.75}));orbit.rotation.set(1.05,.25,.45);gemGroup.add(orbit);
  gemGroup.position.y=.1;productScene.add(gemGroup);
  $('#product-caption').textContent=`ORBIT OBJECT · ${floor.number}F · 拖曳旋轉`;
}
function selectFloor(id) {
  const floor=floors.find(item=>item.id===id);if(!floor)return;
  selectedFloor=id;const group=floorGroups.get(id);if(!group)return;
  $('#panel-idle').hidden=true;$('#panel-detail').hidden=false;
  $('#detail-floor').textContent=String(floor.number);$('#detail-number').textContent=String(floor.number);$('#detail-title').textContent=floor.name;$('#detail-eyebrow').textContent=floor.eyebrow;$('#detail-description').textContent=floor.description;
  $('#detail-status').textContent='開放預約中';$('#detail-tags').innerHTML=floor.tags.map(tag=>`<span>${tag}</span>`).join('');
  $('#floor-panel').style.setProperty('--accent',floor.color);
  $('#product-caption').textContent=`ORBIT OBJECT · ${floor.number}F · 拖曳旋轉`;
  document.querySelectorAll('.floor-chip').forEach(button=>button.classList.toggle('is-selected',button.dataset.floor===id));
  createProductViewer(floor);
  const p=group.getWorldPosition(new THREE.Vector3());
  desiredTarget.set(p.x,p.y,p.z);
  const offset=new THREE.Vector3(7.6,3.7,9.2);offset.applyAxisAngle(new THREE.Vector3(0,1,0),camera.position.x<0?-.12:.12);
  desiredCamera.copy(p).add(offset);
  if(currentMode==='grid')setMode('spatial');
}
function resetView(){selectedFloor=null;desiredCamera.copy(baseCamera);desiredTarget.copy(baseTarget);$('#panel-detail').hidden=true;$('#panel-idle').hidden=false;document.querySelectorAll('.floor-chip').forEach(button=>button.classList.remove('is-selected'));}
function setMode(mode){currentMode=mode;const grid=mode==='grid';$('#grid-view').hidden=!grid;$('.scene-copy').style.visibility=grid?'hidden':'visible';$('#floor-panel').style.visibility=grid?'hidden':'visible';$('.floor-rail').style.visibility=grid?'hidden':'visible';$('.scene-controls').style.visibility=grid?'hidden':'visible';$('.scene-vignette').style.visibility=grid?'hidden':'visible';document.querySelectorAll('.mode-button').forEach(button=>{const active=button.dataset.mode===mode;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});}
function renderDirectories(){
  const rail=$('#floor-rail'),grid=$('#floor-grid');
  floors.forEach(floor=>{
    const button=document.createElement('button');button.type='button';button.className='floor-chip';button.dataset.floor=floor.id;button.style.setProperty('--chip-color',floor.color);button.innerHTML=`<b>${String(floor.number).padStart(2,'0')}</b><span>${floor.name}</span>`;button.setAttribute('aria-label',`前往 ${floor.number} 樓 ${floor.name}`);button.addEventListener('click',()=>selectFloor(floor.id));rail.appendChild(button);
    const card=document.createElement('button');card.type='button';card.className='floor-card';card.style.setProperty('--card-color',floor.color);card.innerHTML=`<span class="card-top"><span>FLOOR ${floor.number}</span><b>OPEN</b></span><span><span class="card-title">${floor.name}</span><span class="card-desc">${floor.description}</span></span><span class="card-bottom"><span>開放預約中</span><i>↗</i></span>`;card.addEventListener('click',()=>selectFloor(floor.id));grid.appendChild(card);
  });
}
function onCanvasClick(event){
  if(currentMode!=='spatial'||!renderer)return;
  const rect=canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(clickable,false);if(hits.length)selectFloor(hits[0].object.userData.floorId);
}
function onPointerMove(event){
  if(currentMode!=='spatial'||!renderer||!canvas.matches(':hover'))return;
  const rect=canvas.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(clickable,false);const id=hits[0]?.object.userData.floorId||null;
  if(id!==hoveredFloor){
    if(hoveredFloor&&floorGroups.has(hoveredFloor))floorGroups.get(hoveredFloor).scale.setScalar(1);
    hoveredFloor=id;if(id&&floorGroups.has(id)){floorGroups.get(id).scale.setScalar(1.025);canvas.style.cursor='pointer'}else canvas.style.cursor='grab';
  }
}
function resize(){if(!renderer||!camera)return;const w=stage.clientWidth||innerWidth,h=stage.clientHeight||innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
function resizeProduct(){if(!productRenderer||!productCamera)return;const el=$('.product-shell'),w=el.clientWidth||240,h=el.clientHeight||122;productRenderer.setSize(w,h,false);productCamera.aspect=w/h;productCamera.updateProjectionMatrix();}
function animate(time=0){requestAnimationFrame(animate);const delta=Math.min(clock.getDelta(),.05);const t=time*.001;
  if(renderer&&scene&&camera){
    controls.autoRotate=isAutoRotating&&!selectedFloor;
    camera.position.lerp(desiredCamera,1-Math.pow(.0003,delta));controls.target.lerp(desiredTarget,1-Math.pow(.0003,delta));controls.update();
    movers.forEach(item=>{if(item.starfield){item.mesh.rotation.y+=delta*item.spin;return}if(item.ring){item.mesh.rotation.z+=delta*item.spin;return}item.mesh.position.y=item.baseY+Math.sin(t*1.15+item.phase)*.045;item.mesh.rotation.y+=delta*item.spin;});
    const selected=selectedFloor&&floorGroups.get(selectedFloor);
    if(selected){const pulse=1+Math.sin(t*2.6)*.008;selected.scale.setScalar(pulse)}
    renderer.render(scene,camera);
  }
  if(productRenderer&&productScene&&productCamera){productControls.update();productRenderer.render(productScene,productCamera)}
}
function init(){renderDirectories();const ok=setupScene();if(ok){canvas.addEventListener('click',onCanvasClick);window.addEventListener('pointermove',onPointerMove,{passive:true});new ResizeObserver(resize).observe(stage);requestAnimationFrame(()=>{$('#loading-screen').classList.add('is-hidden')});}
  document.querySelectorAll('.mode-button').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
  $('#rotation-toggle').addEventListener('click',event=>{isAutoRotating=!isAutoRotating;event.currentTarget.textContent=isAutoRotating?'Ⅱ':'▶';event.currentTarget.setAttribute('aria-label',isAutoRotating?'暫停自動旋轉':'繼續自動旋轉');});
  $('#reset-view').addEventListener('click',resetView);$('#panel-close').addEventListener('click',resetView);$('#explore-first').addEventListener('click',()=>selectFloor('core'));
  window.addEventListener('keydown',event=>{if(event.key==='Escape')resetView()});
  animate();
}
init();
