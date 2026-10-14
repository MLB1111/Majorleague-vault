import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
/* Majorleague Vault — Mr Major GLB viewer.
   Loads the supplied character asset and provides drag/swipe, slider, arrows and auto-rotation. */
(() => {
  const host = document.getElementById('mrMajorStage');
  if (!host) return;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080909);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.02, 4.55);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.physicallyCorrectLights = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xf2f5ff, 0x18191b, 2.6));
  const key = new THREE.DirectionalLight(0xffffff, 4.2); key.position.set(3, 6, 5); scene.add(key);
  const rim = new THREE.PointLight(0x00bd86, 8, 9); rim.position.set(-3, 2.5, -3); scene.add(rim);
  const fill = new THREE.PointLight(0xd7e0ed, 3.5, 8); fill.position.set(3, 1.5, 3); scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.MeshStandardMaterial({color:0x080909,roughness:1}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -1.22; scene.add(floor);
  const root = new THREE.Group(); scene.add(root);
  const status = document.createElement('p');
  status.className = 'mr-major-load-status'; status.textContent = 'Loading Mr Major…';
  host.appendChild(status);
  let dragging = false, lastX = 0, rotation = 0, autoRotate = true;
  const slider = document.getElementById('mrMajorRotate');
  const setRotation = v => { rotation = v; root.rotation.y = v; if (slider) slider.value = String(Math.round(((v%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*100)); };
  {
    const loader = new GLTFLoader();
    loader.load('assets/mr-major-majorleague-refined.glb', gltf => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      model.scale.setScalar(2.05 / maxDim);
      // Improve surface shading and repair decal orientation without altering logo artwork.
      model.traverse(node => {
        if (!node.isMesh) return;
        if (node.geometry && node.geometry.attributes && node.geometry.attributes.position) {
          node.geometry.computeVertexNormals();
        }
        if (/Majorleague_(hat|chest|jogger)_logo/i.test(node.name)) {
          const uv = node.geometry && node.geometry.attributes && node.geometry.attributes.uv;
          if (uv && !node.userData.mrMajorUvFixed) {
            for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
            uv.needsUpdate = true;
            node.userData.mrMajorUvFixed = true;
          }
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(mat => {
            if (mat) { mat.side = THREE.DoubleSide; mat.transparent = true; mat.depthWrite = false; mat.needsUpdate = true; }
          });
        } else {
          const mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(mat => {
            if (mat && mat.isMeshStandardMaterial) {
              mat.roughness = Math.max(mat.roughness || 0, 0.68);
              mat.metalness = Math.min(mat.metalness || 0, 0.08);
              mat.needsUpdate = true;
            }
          });
        }
      });
      root.add(model);
      camera.position.set(0, .02, 4.75);
      camera.fov = 36;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      floor.position.y = -(size.y * model.scale.y * .5) - .025;
      // Keep the exact logo textures embedded in the GLB. Replacing these with
      // the header logo distorted the clothing marks and made the hat mark appear inverted.
      status.remove();
    }, undefined, () => {
      status.textContent = 'Mr Major model not found. Upload assets/mr-major-majorleague-refined.glb to the repository.';
      status.classList.add('is-error');
    });
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