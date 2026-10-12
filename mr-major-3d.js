/* Mr Major interactive 3D mascot — procedural Three.js model.
   Drag/swipe to rotate; this is a real 3D scene built from geometry, not a flat rotating image. */
(() => {
  const host = document.getElementById('mrMajorStage');
  if (!host || !window.THREE) return;
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080909);
  scene.fog = new THREE.Fog(0x080909, 8, 19);
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
  camera.position.set(0, 2.72, 10.4);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xdde9ff, 0x17110d, 2.1));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(4, 7, 6); key.castShadow = true; scene.add(key);
  const rim = new THREE.PointLight(0x10c77b, 20, 12); rim.position.set(-4, 3.5, -3); scene.add(rim);
  const fill = new THREE.PointLight(0x9abaff, 8, 10); fill.position.set(4, 2, 4); scene.add(fill);

  const mat = (color, roughness=0.7, metalness=0) => new THREE.MeshStandardMaterial({color, roughness, metalness});
  const black = mat(0x111213, .88), cloth = mat(0x191a1b, .95), seam = mat(0x303233, .9);
  const green = mat(0x00b982, .55), white = mat(0xf2f0e8, .48), sole = mat(0xe8e6df, .65);
  const gold = mat(0xb9914d, .32, .72), blue = mat(0x079bff, .2, .15);
  const skin = mat(0xd8c6ae, .9), skinLight = mat(0xe9d8c1, .86), skinShade = mat(0xbba58b, .95), dark = mat(0x07090b, .35);
  const root = new THREE.Group(); scene.add(root);
  const mascot = new THREE.Group(); root.add(mascot);

  function mesh(geo, material, parent, x,y,z, sx=1,sy=1,sz=1) {
    const m = new THREE.Mesh(geo, material); m.position.set(x,y,z); m.scale.set(sx,sy,sz);
    m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function sphere(parent, material, x,y,z,sx,sy,sz) {
    return mesh(new THREE.SphereGeometry(1, 24, 18), material, parent,x,y,z,sx,sy,sz);
  }
  function cylinder(parent, material, x,y,z,rt,rb,h, sides=32) {
    return mesh(new THREE.CylinderGeometry(rt,rb,h,sides), material,parent,x,y,z);
  }
  function logoTexture(text='Major League') {
    const c = document.createElement('canvas'); c.width=512; c.height=160;
    const ctx=c.getContext('2d'); ctx.clearRect(0,0,512,160);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.font='italic 700 68px Georgia, serif';
    ctx.shadowColor='#000'; ctx.shadowBlur=3;
    ctx.fillStyle='#00b98a'; ctx.fillText('Major',218,80);
    ctx.fillStyle='#f6f4ed'; ctx.fillText('League',340,80);
    const tex=new THREE.CanvasTexture(c); tex.colorSpace=THREE.SRGBColorSpace; return tex;
  }
  const logoMat = new THREE.MeshBasicMaterial({map:logoTexture(), transparent:true, side:THREE.DoubleSide, depthWrite:false});
  const patchMat = mat(0xb9b5a7, .9);
  // Legs: plain slim black joggers, no side stripes and no rear-pocket logo.
  for (const side of [-1,1]) {
    const x=side*.34;
    const leg=mesh(new THREE.CylinderGeometry(.205,.145,.94,24),cloth,mascot,x,.76,0);
    leg.rotation.z=side*-.035;
    sphere(mascot,cloth,x,.32,.015,.15,.19,.17); // ankle cuff
    // Sneakers: white midsole, black upper, green accents
    mesh(new THREE.BoxGeometry(.39,.13,.69),sole,mascot,x,.16,.12,1,1,1);
    mesh(new THREE.BoxGeometry(.38,.24,.57),black,mascot,x,.29,.12,1,1,1);
    sphere(mascot,green,x,.34,.34,.12,.075,.08);
    for(let i=0;i<3;i++){
      const lace=mesh(new THREE.BoxGeometry(.16,.018,.035),white,mascot,x,.39,.06+i*.085);
      lace.rotation.y=side*.12;
    }
    mesh(new THREE.BoxGeometry(.045,.09,.2),green,mascot,x+side*.17,.35,.12);
  }
  // Hoodie body, pouch, hood and sleeves
  sphere(mascot,cloth,0,1.67,0,.73,.81,.43);
  sphere(mascot,black,0,2.28,-.17,.48,.42,.32);
  // front pouch
  mesh(new THREE.BoxGeometry(.92,.3,.08),black,mascot,0,1.35,.405);
  const zip=mesh(new THREE.BoxGeometry(.035,.62,.025),gold,mascot,0,2.0,.437);
  // drawstrings
  for(const x of [-.22,.22]){
    const cord=cylinder(mascot,black,x,1.91,.46,.018,.018,.46,8);
    cord.rotation.z=x*.16;
  }
  // sleeves and hands subtly peeking at pouch
  for(const side of [-1,1]){
    const sleeve=sphere(mascot,cloth,side*.72,1.73,.02,.27,.62,.27); sleeve.rotation.z=side*-.24;
    sphere(mascot,skin,side*.39,1.32,.37,.13,.12,.12);
    cylinder(mascot,seam,side*.73,1.32,.01,.22,.21,.1);
  }
  // chest patch with accurate green/white branding texture
  mesh(new THREE.BoxGeometry(.94,.29,.055),patchMat,mascot,0,1.94,.428);
  const patchLogo=mesh(new THREE.PlaneGeometry(.83,.21),logoMat,mascot,0,1.94,.461);
  // Head: base plus irregular cloud/brain-like puffs
  sphere(mascot,skin,0,3.05,.02,.91,.77,.66);
  const rng=(a,b)=>a+Math.random()*(b-a);
  for(let i=0;i<62;i++){
    const angle=i*Math.PI*(3-Math.sqrt(5));
    const y=1-(i/61)*2;
    const rr=Math.sqrt(1-y*y);
    const x=Math.cos(angle)*rr, z=Math.sin(angle)*rr;
    sphere(mascot,i%4===0?skinLight:skin,x*.83,3.06+y*.67,.03+z*.56,
      rng(.14,.23),rng(.13,.21),rng(.12,.2));
  }
  // eyes, brows, nose and confident smirk on front (+Z)
  for(const side of [-1,1]){
    sphere(mascot,white,side*.34,3.12,.605,.285,.17,.105);
    sphere(mascot,blue,side*.34,3.105,.698,.145,.125,.045);
    sphere(mascot,dark,side*.34,3.12,.718,.072,.09,.025);
    sphere(mascot,white,side*.38,3.17,.74,.035,.035,.014);
    const brow=sphere(mascot,skinLight,side*.34,3.34,.61,.36,.16,.13); brow.rotation.z=side*-.10;\n    const lid=sphere(mascot,skin,side*.34,3.205,.684,.27,.075,.055); lid.rotation.z=side*-.035;
  }
  sphere(mascot,skinLight,0,2.91,.69,.19,.125,.13);\n  // subtle cheek folds reinforce the original cloud-textured sculpted face\n  for(const side of [-1,1]){\n    for(let j=0;j<3;j++){const fold=sphere(mascot,skinShade,side*(.48+j*.045),2.91-j*.075,.605-j*.012,.055,.018,.012);fold.rotation.z=side*-.28;}\n  }
  // smirk curve
  const smilePts=[new THREE.Vector3(-.28,2.78,.685),new THREE.Vector3(-.14,2.74,.72),new THREE.Vector3(.02,2.74,.73),new THREE.Vector3(.2,2.77,.69),new THREE.Vector3(.28,2.81,.66)];
  const smile= new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(smilePts),24,.022,8,false),dark); mascot.add(smile);
  // bucket hat brim and crown
  cylinder(mascot,black,0,3.69,.01,1.03,.88,.14,48);
  cylinder(mascot,cloth,0,3.91,.01,.69,.72,.49,48);
  cylinder(mascot,seam,0,3.68,.01,.71,.71,.035,48);
  // logo on hat front
  const hatLogo=mesh(new THREE.PlaneGeometry(.76,.235),logoMat,mascot,0,3.92,.704);
  // tiny hat stitch accents
  for(let i=-2;i<=2;i++){
    const st=mesh(new THREE.BoxGeometry(.11,.025,.012),seam,mascot,i*.25,3.65,.79);
    st.rotation.z=-i*.04;
  }
  // floor and circular plinth
  const floor=mesh(new THREE.PlaneGeometry(200,200),mat(0x080909,.95),scene,0,-.015,0);
  floor.rotation.x=-Math.PI/2; floor.receiveShadow=true;
  const plinth=cylinder(scene,mat(0x151819,.35,.35),0,.015,0,1.25,1.25,.08,64);
  const ring=mesh(new THREE.TorusGeometry(1.18,.012,8,80),green,scene,0,.06,0); ring.rotation.x=Math.PI/2;
  // position to fit stage
  mascot.position.y=.06;
  root.position.y=-.05;

  let dragging=false,lastX=0,rotation=0;
  const slider=document.getElementById('mrMajorRotate');
  const setRotation=v=>{rotation=v;root.rotation.y=v; if(slider) slider.value=String(Math.round(((v%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*100));};
  renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor='grabbing';});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;lastX=e.clientX;setRotation(rotation+dx*.012);});
  const endDrag=()=>{dragging=false;renderer.domElement.style.cursor='grab';};
  renderer.domElement.addEventListener('pointerup',endDrag);renderer.domElement.addEventListener('pointercancel',endDrag);
  renderer.domElement.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')setRotation(rotation-.18);if(e.key==='ArrowRight')setRotation(rotation+.18);});
  renderer.domElement.tabIndex=0; renderer.domElement.setAttribute('aria-label','Mr Major 3D model. Drag or swipe to rotate.');
  if(slider)slider.addEventListener('input',()=>setRotation(Number(slider.value)/100*Math.PI*2));
  document.getElementById('mrMajorPrev')?.addEventListener('click',()=>setRotation(rotation-.55));
  document.getElementById('mrMajorNext')?.addEventListener('click',()=>setRotation(rotation+.55));
  const resize=()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(host); resize();
  const clock=new THREE.Clock();
  function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();if(!dragging){mascot.position.y=.06+Math.sin(t*1.2)*.025;}renderer.render(scene,camera);}
  animate();
})();
