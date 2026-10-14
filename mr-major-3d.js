/* Majorleague Vault — Mr Major GLB viewer.
   Loads the supplied character asset and provides drag/swipe, slider, arrows and auto-rotation. */
(() => {
  const host = document.getElementById('mrMajorStage');
  if (!host || !window.THREE) return;
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080909);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.25, 4.8);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xe7efff, 0x17110d, 2.0));
  const key = new THREE.DirectionalLight(0xffffff, 3.0); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.PointLight(0x00d7a0, 16, 9); rim.position.set(-3, 2.5, -3); scene.add(rim);
  const fill = new THREE.PointLight(0x9abaff, 5, 8); fill.position.set(3, 1.5, 3); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.MeshStandardMaterial({color:0x080909,roughness:.95}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -1.02; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.72,.009,8,80), new THREE.MeshStandardMaterial({color:0x00bd86,metalness:.25,roughness:.45}));
  ring.rotation.x = Math.PI/2; ring.position.y = -1.0; scene.add(ring);
  const root = new THREE.Group(); scene.add(root);
  const status = document.createElement('p');
  status.className = 'mr-major-load-status'; status.textContent = 'Loading Mr Major…';
  host.appendChild(status);
  let dragging = false, lastX = 0, rotation = 0, autoRotate = true;
  const slider = document.getElementById('mrMajorRotate');
  const setRotation = v => { rotation = v; root.rotation.y = v; if (slider) slider.value = String(Math.round(((v%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*100)); };
  if (THREE.GLTFLoader) {
    const loader = new THREE.GLTFLoader();
    loader.load('assets/mr-major-majorleague-refined.glb', gltf => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      model.scale.setScalar(2.35 / maxDim);
      root.add(model);
      camera.position.set(0, .05, 3.8);
      camera.lookAt(0, 0, 0);
      floor.position.y = -(size.y * model.scale.y * .5) - .08;
      ring.position.y = floor.position.y + .015;
      status.remove();
    }, undefined, () => {
      status.textContent = 'Mr Major model not found. Upload assets/mr-major-majorleague-refined.glb to the repository.';
      status.classList.add('is-error');
    });
  } else {
    status.textContent = '3D viewer library did not load. Please refresh the page.';
    status.classList.add('is-error');
  }
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', e => { dragging=true; autoRotate=false; lastX=e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor='grabbing'; });
  canvas.addEventListener('pointermove', e => { if (!dragging) return; const dx=e.clientX-lastX; lastX=e.clientX; setRotation(rotation+dx*.012); });
  const endDrag = () => { dragging=false; canvas.style.cursor='grab'; };
  canvas.addEventListener('pointerup',endDrag); canvas.addEventListener('pointercancel',endDrag);
  canvas.addEventListener('keydown', e => { if(e.key==='ArrowLeft')setRotation(rotation-.18); if(e.key==='ArrowRight')setRotation(rotation+.18); });
  canvas.tabIndex=0; canvas.setAttribute('aria-label','Mr Major 3D model. Drag or swipe to rotate.');
  if(slider) slider.addEventListener('input',()=>{autoRotate=false;setRotation(Number(slider.value)/100*Math.PI*2);});
  document.getElementById('mrMajorPrev')?.addEventListener('click',()=>{autoRotate=false;setRotation(rotation-.55);});
  document.getElementById('mrMajorNext')?.addEventListener('click',()=>{autoRotate=false;setRotation(rotation+.55);});
  const resize=()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host); else window.addEventListener('resize',resize);
  resize();
  function animate(){requestAnimationFrame(animate);if(autoRotate&&!dragging)setRotation(rotation+.003);renderer.render(scene,camera);}
  animate();
})();