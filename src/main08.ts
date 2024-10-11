import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const scene = new THREE.Scene();
scene.environment = new THREE.CubeTextureLoader()
  .setPath("https://sbcode.net/img/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper();
gridHelper.position.y = -1;
scene.add(gridHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const boxGeometry = new THREE.BoxGeometry();

const sphereGeometry = new THREE.SphereGeometry();

const icosahedronGeometry = new THREE.IcosahedronGeometry();

const planeGeometry = new THREE.PlaneGeometry();

const torusKnotGeometry = new THREE.TorusKnotGeometry();

const material = new THREE.MeshStandardMaterial();

const cube = new THREE.Mesh(boxGeometry, material);
cube.position.set(5, 0, 0);
scene.add(cube);

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.set(3, 0, 0);
scene.add(sphere);

const icosahedron = new THREE.Mesh(icosahedronGeometry, material);
icosahedron.position.set(0, 0, 0);
scene.add(icosahedron);

const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(-2, 0, 0);
scene.add(plane);

const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
torusKnot.position.set(-5, 0, 0);
scene.add(torusKnot);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const stats = new Stats();
document.body.appendChild(stats.dom);

const options = {
  side: {
    // 앞면만 로딩 : 성능 최적화
    FrontSide: THREE.FrontSide,
    // 안쪽 로딩 : 방 안을 보는 것 같음
    BackSide: THREE.BackSide,
    // 양쪽 다 로딩 : 평면 요소를 앞 뒤 다 볼 수 있지만 성능이 떨어짐
    DoubleSide: THREE.DoubleSide,
  },
};

const gui = new GUI();

const materialFolder = gui.addFolder("THREE.Material");
// opacity를 변경하기 위해서는 transparent를 설정해야한다.
materialFolder
  .add(material, "transparent")
  .onChange(() => (material.needsUpdate = true));
materialFolder.add(material, "opacity", 0, 1, 0.01);
// alphaTest는 opacity와 관련이 있다.
// alphaTest를 0.5로 설정해두면 opacity가 0.5 이하로 가면 사라짐
materialFolder
  .add(material, "alphaTest", 0, 1, 0.01)
  .onChange(() => updateMaterial());
materialFolder.add(material, "visible");
materialFolder
  .add(material, "side", options.side)
  .onChange(() => updateMaterial());
materialFolder.open();

// 렌더링 방식을 변경하는 곳에 사용
// opacity 같은 속성은 재료의 기본 속성을 변경하는 거라 괜찮
function updateMaterial() {
  material.side = Number(material.side) as THREE.Side;
  material.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);

  stats.update();
}

animate();
