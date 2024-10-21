import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

const scene = new THREE.Scene();

const gridHelper = new THREE.GridHelper();
gridHelper.position.y = -0.5;
scene.add(gridHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const info = document.createElement("div");
info.style.cssText =
  "position:absolute;bottom:10px;left:10px;color:white;font-family:monospace;font-size: 17px;filter: drop-shadow(1px 1px 1px #000000);";
document.body.appendChild(info);

const controls = new OrbitControls(camera, renderer.domElement);

// 카메라가 보는 곳을 설정
// camera.lookAt(0.5, 0.5, 0.5);
// 카메라가 보는 중심을 설정
// controls.target.set(0.5, 0.5, 0.5);
// orbital control 업데이트
// controls.update();

// controls.addEventListener("change", () => console.log("Controls Change"));
// controls.addEventListener("start", () => console.log("Controls Start Event"));
// controls.addEventListener("end", () => console.log("Controls End Event"));

// 자동 회전 옵션
// controls.autoRotate = true;
// controls.autoRotateSpeed = 10;
// 카메라 움직임이 보다 부드럽게 감속되도록 만드는 기능
// controls.enableDamping = true;
// 감속 정도
// controls.dampingFactor = .01
// 방향키 사용해서 카메라 위치 변경
// controls.listenToKeyEvents(window);
// 방향키 변경
// controls.keys = {
//   LEFT: "KeyA", // default 'ArrowLeft'
//   UP: "KeyW", // default 'ArrowUp'
//   RIGHT: "KeyD", // default 'ArrowRight'
//   BOTTOM: "KeyS", // default 'ArrowDown'
// };
// controls.mouseButtons = {
//   LEFT: THREE.MOUSE.ROTATE,
//   MIDDLE: THREE.MOUSE.DOLLY,
//   RIGHT: THREE.MOUSE.PAN,
// };
// 터치 방법 변경
// controls.touches = {
//     ONE: THREE.TOUCH.ROTATE,
//     TWO: THREE.TOUCH.DOLLY_PAN
// }
// controls.screenSpacePanning = true
// 카메라가 좌우로 회전할 수 있는 최소, 최대 방위각을 설정
// controls.minAzimuthAngle = 0
// controls.maxAzimuthAngle = Math.PI / 2
// 카메라가 위아래로 회전할 수 있는 최소, 최대 극각을 설정
// controls.minPolarAngle = 0
// controls.maxPolarAngle = Math.PI
// controls.maxDistance = 4
// controls.minDistance = 1.5
// 컨트롤 활성화 설정
// controls.enabled = false;
// 카메라 중심 이동 못함
// controls.enablePan = false;
// 카메라 돌리지 못함
// controls.enableRotate = false
// 카메라 줌 못함
// controls.enableZoom = false

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  info.innerText =
    "Polar Angle : " +
    ((controls.getPolarAngle() / -Math.PI) * 180 + 90).toFixed(2) +
    "°\nAzimuth Angle : " +
    ((controls.getAzimuthalAngle() / Math.PI) * 180).toFixed(2) +
    "°";

  renderer.render(scene, camera);

  stats.update();
}

animate();
