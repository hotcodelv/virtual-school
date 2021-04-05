import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import sunTexture from "./sun.jpg";
import { planet_data } from "./planets";

import camera_para from "./data/camera_para.dat";
import pattern from "./data/hiro.patt";

import { THREEx } from "./threex/join";

var camera;
var scene;
var renderer;
var controls;
var secondsInDay = 87600;
var markerRoot1;

var arToolkitSource, arToolkitContext;

function init() {
  camera = new THREE.PerspectiveCamera(145, window.innerWidth / window.innerHeight, 0.1, 180000);
  camera.position.set(0, 0, 0.01);
  scene = new THREE.Scene();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(640, 480);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";

  const loader = new THREE.TextureLoader();

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });

  function onResize() {
    arToolkitSource.onResize();
    arToolkitSource.copySizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(function onReady() {
    onResize();
  });

  // handle resize event
  window.addEventListener("resize", function () {
    onResize();
  });

  ////////////////////////////////////////////////////////////
  // setup arToolkitContext
  ////////////////////////////////////////////////////////////

  // create atToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: camera_para,
    detectionMode: "mono",
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  markerRoot1 = new THREE.Group();
  scene.add(markerRoot1);
  let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
    type: "pattern",
    patternUrl: pattern,
  });

  var sunLight = new THREE.PointLight(0xffffff);
  sunLight.position.set(0, 0, 0);
  markerRoot1.add(sunLight);

  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);

  var sunGeometry = new THREE.SphereGeometry(1, 50, 50);
  var sunMaterial = new THREE.MeshPhongMaterial({
    map: loader.load(sunTexture),
    color: 0xf2e8b7,
    emissive: 0x91917b,
    specular: 0x777d4a,
    shininess: 0,
  });
  var sunObject = new THREE.Mesh(sunGeometry, sunMaterial);
  markerRoot1.add(sunObject);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  var planets = [];
  planet_data.forEach(function (planet) {
    let attachment = null;
    if (planet.attachment) {
      attachment = {
        name: planet.attachment.name,
        theta: 0,
        dTheta: (2 * Math.PI) / (planet.attachment.period_days * secondsInDay),
        diameter: planet.attachment.diameter / 18000,
        distance_KM: planet.attachment.distance_KM * 0.00000004,
        inclination: planet.attachment.inclination * (Math.PI / 180),
        rotation: (2 * Math.PI) / (planet.attachment.rotation_days * secondsInDay),
        texture: planet.attachment.texture,
      };
    }

    planets.push({
      name: planet.name,
      theta: 0,
      dTheta: (2 * Math.PI) / (planet.period_days * secondsInDay),
      diameter: planet.diameter / 18000,
      distance_KM: planet.distance_KM * 0.00000004,
      inclination: planet.inclination * (Math.PI / 180),
      rotation: (2 * Math.PI) / (planet.rotation_days * secondsInDay),
      texture: planet.texture,
      attachment: attachment,
    });
  });

  planets.forEach(function (planet) {
    var targetMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      dashSize: 5,
      gapSize: 5,
    });

    var targetOrbit = new THREE.EllipseCurve(0, 0, planet.distance_KM, planet.distance_KM, 0, 2.0 * Math.PI, false);

    let points = targetOrbit.getPoints(1000);

    var targetPath = new THREE.CurvePath(points);

    targetPath.add(targetOrbit);

    var targetGeometry = new THREE.BufferGeometry().setFromPoints(points);

    var targetTrajectory = new THREE.Line(targetGeometry, targetMaterial);
    targetTrajectory.rotation.x = Math.PI / 2;
    targetTrajectory.rotation.x += planet.inclination;

    markerRoot1.add(targetTrajectory);
  });

  function createMeshFrom(planet, distance) {
    const geometry = new THREE.SphereGeometry(planet.diameter, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      map: loader.load(planet.texture),
      color: 0xf2f2f2,
      specular: 0xbbbbbb,
      shininess: 2,
    });

    planet.mesh = new THREE.Mesh(geometry, material);
    planet.mesh.position.x = distance;
    return planet.mesh;
  }

  planets.forEach((planet) => {
    markerRoot1.add(createMeshFrom(planet, planet.distance_KM));
    if (planet.attachment) {
      markerRoot1.add(
        createMeshFrom(planet.attachment, 1 + planet.diameter + planet.distance_KM + planet.attachment.distance_KM)
      );
    }
  });

  document.body.appendChild(renderer.domElement);

  var t1 = Date.now() / 1000;
  const timeScale = 1000000;

  function animate() {
    var t2 = Date.now() / 1000;
    var dT = (t2 - t1) * timeScale;
    t1 = t2;

    planets.forEach(function (planet) {
      planet.mesh.rotation.y += planet.rotation * 10;

      var dTheta = planet.dTheta * dT;
      planet.theta += dTheta;

      var phi = planet.inclination * Math.sin(planet.theta);
      planet.mesh.position.z = planet.distance_KM * Math.sin(planet.theta);
      planet.mesh.position.x = planet.distance_KM * Math.cos(planet.theta);
      planet.mesh.position.y = -planet.distance_KM * Math.cos(Math.PI / 2 - phi);

      if (planet.attachment) {
        var dTheta = planet.attachment.dTheta * dT;
        planet.attachment.theta += dTheta;

        var phi = planet.attachment.inclination * Math.sin(planet.attachment.theta);

        const distance = planet.diameter + planet.attachment.diameter + planet.attachment.distance_KM;

        planet.attachment.mesh.position.z = planet.mesh.position.z + distance * Math.sin(planet.attachment.theta);
        planet.attachment.mesh.position.x = planet.mesh.position.x + distance * Math.cos(planet.attachment.theta);
        planet.attachment.mesh.position.y = -planet.attachment.distance_KM * Math.cos(Math.PI / 2 - phi);
      }
    });

    requestAnimationFrame(animate);
    if (arToolkitSource.ready !== false) arToolkitContext.update(arToolkitSource.domElement);
    renderer.render(scene, camera);
  }
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
