//////Create a Canvas and Draw Text:

//Create an HTML canvas element.
//Use the canvas context to draw the desired text.
//Create a Texture from the Canvas:

//Convert the canvas into a texture using THREE.CanvasTexture.
//Create a SpriteMaterial:

//Use the texture to create a sprite material with THREE.SpriteMaterial.
//Create a Sprite:

//Use the sprite material to create a sprite with THREE.Sprite.
//Position the Sprite:

//Place the sprite at the desired location in the scene.
/////


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

// Add a Sphere
const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: "green" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.name = "BigSphere";  // Give it a name
scene.add(sphere);

// Add a Cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-20, 5, 0);
cube.castShadow = true;
cube.name = "RedCube";  // Give it a name
scene.add(cube);

// Load OBJ models
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

// Function to create text canvas
function createTextCanvas(text, color, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const textWidth = context.measureText(text).width; // Measure the width of the text
    canvas.width = textWidth + 40;  // Set canvas width to accommodate the text, with some padding
    canvas.height = 128; // Increased height to accommodate larger fonts
    context.font = font;  // Set font again after resizing
    context.fillStyle = color;
    context.fillText(text, 20, 90); // Adjust position to center text vertically
    return canvas;
}

// Function to create text texture
function createTextTexture(text, color = 'white', font = 'Bold 100px Arial') { // Increased font size
    const canvas = createTextCanvas(text, color, font);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// Function to create text sprite material
function createTextSpriteMaterial(text, color, font) {
    const texture = createTextTexture(text, color, font);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    return spriteMaterial;
}

// Function to create text sprite
function createTextSprite(text, color, font) {
    const spriteMaterial = createTextSpriteMaterial(text, color, font);
    const sprite = new THREE.Sprite(spriteMaterial);
    return sprite;
}

// Add text sprite to the scene
const textSprite = createTextSprite('Hello World', 'Black', 'Bold 70px Arial'); // Increased font size
textSprite.position.set(0, 10, 10); // Position it above the object
scene.add(textSprite);

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