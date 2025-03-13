import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Light blue sky

// Camera setup
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 50, 150);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 30, 0);
scene.add(pointLight);

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -10;
plane.receiveShadow = true;
scene.add(plane);

// ✅ Add a Sphere
const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "green" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.name = "BigSphere";  // Give it a name
scene.add(sphere);

// ✅ Add a Cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-20, 5, 0);
cube.castShadow = true;
cube.name = "RedCube";  // Give it a name
scene.add(cube);

// ✅ Load OBJ models
const objLoader1 = new OBJLoader();
objLoader1.load('/models/Ball OBJ.obj', (object) => {
    object.position.set(20, 0, 0);
    object.scale.set(5, 5, 5);
    object.castShadow = true;
    
    object.traverse((child) => {
        if (child.isMesh) {
            child.name = "BigFootball"; // Rename all meshes inside
        }
    });

    scene.add(object);
});

const objLoader2 = new OBJLoader();
objLoader2.load('/models/Ball OBJ.obj', (object) => {
    object.position.set(15, 5, 0);
    object.scale.set(2, 2, 2);
    object.castShadow = true;
    
    object.traverse((child) => {
        if (child.isMesh) {
            child.name = "SmallFootball"; // Rename all meshes inside
        }
    });

    scene.add(object);
});

// ✅ Raycaster Setup
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const points = [];
let line = null;

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onClick(_event) {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const point = intersects[0].point;
        points.push(point);
        console.log(`Clicked at X=${point.x}, Y=${point.y}, Z=${point.z}`);
        updateLine();
    }
}

function updateLine() {
    if (points.length < 2) return;
    
    if (line) {
        scene.remove(line);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    line = new THREE.Line(geometry, material);
    scene.add(line);
}

window.addEventListener('pointermove', onPointerMove);
window.addEventListener('click', onClick);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
