import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 1.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

const controls = new OrbitControls(camera, renderer.domElement);
// 성능 최적화 ***
controls.addEventListener("change", () => {
  renderer.render(scene, camera);
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const stats = new Stats();
document.body.appendChild(stats.dom);

// const clock = new THREE.Clock();
// let delta;
// function animate() {
//   // 브라우저가 화면을 갱신하는 빈도에 따라 실행됨
//   // 60fps라면 1초에 60번 실행됨 120fps라면 1초에 120번 실행됨

//   // requestAnimationFrame 안에서 다시 requestAnimationFrame을 호출하면 애니메이션이 계속 실행됨
//   requestAnimationFrame(animate);

//   delta = clock.getDelta();

//   cube.rotation.x += delta;
//   cube.rotation.y += delta;

//   renderer.render(scene, camera);

//   stats.update();
// }

// animate();

renderer.render(scene, camera);
