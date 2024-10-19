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
  scene.backgroundBlurriness = 0.5;
});

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
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

const raycaster = new THREE.Raycaster();
const pickables: THREE.Mesh[] = [];
const mouse = new THREE.Vector2();

const arrowHelper = new THREE.ArrowHelper();
arrowHelper.setLength(0.5);
scene.add(arrowHelper);

// raycaster는 화면상에서 발생하는 이벤트를 기반으로 광선을 발사해서 그 광선이 어떤 객체와 교차하는지 계산하는 기능을 제공한다.
renderer.domElement.addEventListener("mousemove", (e) => {
  // 마우스 좌표를 NDC 좌표로 변환
  mouse.set(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
  );

  // 카메라를 기준으로 광선을 발사
  raycaster.setFromCamera(mouse, camera);

  // 교차한 객체 정보 가져오기
  const intersects = raycaster.intersectObjects(pickables, false);

  // 교차한 객체가 있을 경우
  if (intersects.length) {
    console.log(intersects);
    // console.log(intersects[0].point);
    // console.log(intersects[0].object.name + " " + intersects[0].distance);
    // console.log((intersects[0].face as THREE.Face).normal);
    const n = new THREE.Vector3();
    // 교차하는 물체가 향하는 방향을 복사함
    n.copy((intersects[0].face as THREE.Face).normal);
    //     //n.transformDirection(intersects[0].object.matrixWorld)
    arrowHelper.setDirection(n);
    // 마우스 포인터가 가리키고 있는 객체 표면의 정확한 교차 지점
    arrowHelper.position.copy(intersects[0].point);
  }
});

renderer.domElement.addEventListener("dblclick", (e) => {
  mouse.set(
    (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(pickables, false);

  if (intersects.length) {
    const n = new THREE.Vector3();
    n.copy((intersects[0].face as THREE.Face).normal);
    n.transformDirection(intersects[0].object.matrixWorld);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshStandardMaterial()
    );
    cube.lookAt(n);
    cube.position.copy(intersects[0].point);
    cube.position.addScaledVector(n, 0.1001);
    cube.castShadow = true;

    scene.add(cube);
    pickables.push(cube);
  }
});

new GLTFLoader().load("models/suzanne_scene.glb", (gltf) => {
  const suzanne = gltf.scene.getObjectByName("Suzanne") as THREE.Mesh;
  suzanne.castShadow = true;
  // @ts-ignore
  // suzanne.material.map.colorSpace = THREE.LinearSRGBColorSpace;
  pickables.push(suzanne);

  const plane = gltf.scene.getObjectByName("Plane") as THREE.Mesh;
  plane.receiveShadow = true;
  pickables.push(plane);

  const spotLight = gltf.scene.getObjectByName("Spot") as THREE.SpotLight;
  spotLight.intensity /= 500;
  spotLight.castShadow = true;

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
