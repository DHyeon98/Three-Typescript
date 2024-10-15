import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

const scene = new THREE.Scene();

const light = new THREE.SpotLight(undefined, Math.PI * 1000);
light.position.set(5, 5, 5);
light.angle = Math.PI / 16;
light.castShadow = true;
scene.add(light);

// const helper = new THREE.SpotLightHelper(light)
// scene.add(helper)

new RGBELoader().load("images/illovo_beach_balcony_4k.hdr", (texture) => {
  console.log(texture);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1.5, 0.75, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
// 밝은 영역을 적절히 억제하고 어두운 영역을 부드럽게 처리해 자연스러운 명암을 표현
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 반적인 노출값을 제어하며, 값이 클수록 밝아지고 작을수록 어두워짐
renderer.toneMappingExposure = 0.1;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load(
  "https://cdn.jsdelivr.net/gh/Sean-Bradley/First-Car-Shooter@main/dist/client/img/lensflare0.png"
);

// Three.js에서 제공하는 객체로, 렌즈 플레어 효과를 구현하는 데 사용
const lensflare = new Lensflare();
// LensflareElement는 렌즈 플레어의 개별 요소를 나타냅니다. 여기서는 textureFlare0 텍스처를 사용해 렌즈 플레어 요소를 만듭니다.
// LensflareElement 생성자는 다음 세 가지 매개변수를 받습니다:
// 텍스처: textureFlare0, 렌즈 플레어의 이미지.
// 크기: 1000, 렌즈 플레어 요소의 크기.
// 위치 오프셋: 0, 렌즈 플레어 요소가 빛을 중심으로부터 얼마나 떨어져 있는지를 나타냅니다.
// 이 예시에서는 0으로 설정되어 있으므로 빛의 중심에 배치됩니다.
lensflare.addElement(new LensflareElement(textureFlare0, 1000, 0));
// 조명에 렌즈 플레어 효과를 추가하는 부분
light.add(lensflare);

new GLTFLoader().load("models/suzanne_scene.glb", (gltf) => {
  console.log(gltf);

  const suzanne = gltf.scene.getObjectByName("Suzanne") as THREE.Mesh;
  suzanne.castShadow = true;

  const plane = gltf.scene.getObjectByName("Plane") as THREE.Mesh;
  plane.receiveShadow = true;

  scene.add(gltf.scene);
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
