import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

new RGBELoader().load("images/illovo_beach_balcony_4k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
  scene.backgroundBlurriness = 1.0;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2, 1, -2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.y = 0.75;
controls.enableDamping = true;

// const loader = new GLTFLoader();
// let suvBody: THREE.Object3D;
// // 해당 모델이 중복되므로 캐시된다.
// // 실제로 내 서버에서 해당 모델을 4번 다운로드 하지 않는다.
// // 모델 로더는 비동기 작업이다.
// loader.load("models/suv_body.glb", (gltf) => {
//   suvBody = gltf.scene;

//   // suvBody 코드 안으로 넣어주었기 때문에 suvBody 로드가 끝나면 바퀴가 로드된다.
//   loader.load("models/suv_wheel.glb", (gltf) => {
//     gltf.scene.position.set(-0.65, 0.2, -0.77);
//     // suvBody으로 add 해준다.
//     // 이렇게 하면 suvBody가 움직일 때 같이 움직임
//     suvBody.add(gltf.scene);
//   });
//   loader.load("models/suv_wheel.glb", (gltf) => {
//     gltf.scene.position.set(0.65, 0.2, -0.77);
//     gltf.scene.rotateY(Math.PI);
//     suvBody.add(gltf.scene);
//   });
//   loader.load("models/suv_wheel.glb", (gltf) => {
//     gltf.scene.position.set(-0.65, 0.2, 0.57);
//     suvBody.add(gltf.scene);
//   });
//   loader.load("models/suv_wheel.glb", (gltf) => {
//     gltf.scene.position.set(0.65, 0.2, 0.57);
//     gltf.scene.rotateY(Math.PI);
//     suvBody.add(gltf.scene);
//   });
//   scene.add(gltf.scene);
// });
const loader = new GLTFLoader();
let suvBody: THREE.Object3D;
await loader.loadAsync("models/suv_body.glb").then((gltf) => {
  suvBody = gltf.scene;
});
loader.load("models/suv_wheel.glb", function (gltf) {
  const wheels = [
    gltf.scene,
    gltf.scene.clone(),
    gltf.scene.clone(),
    gltf.scene.clone(),
  ];
  wheels[0].position.set(-0.65, 0.2, -0.77);
  wheels[1].position.set(0.65, 0.2, -0.77);
  wheels[1].rotateY(Math.PI);
  wheels[2].position.set(-0.65, 0.2, 0.57);
  wheels[3].position.set(0.65, 0.2, 0.57);
  wheels[3].rotateY(Math.PI);
  suvBody.add(...wheels);
  scene.add(suvBody);
});

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();
