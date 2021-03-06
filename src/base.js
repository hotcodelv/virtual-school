import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var camera = new THREE.PerspectiveCamera(145, window.innerWidth / window.innerHeight, 0.1, 180000);
camera.position.set(0, 0, 0.01);

var scene = new THREE.Scene();
scene.add(camera);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";

var controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const secondsInDay = 87600;
const distanceScale = 0.00000004;
const diameterScale = 18000;
const timeScale = 1000000;

export { camera, scene, renderer, controls, secondsInDay, distanceScale, diameterScale, timeScale };
