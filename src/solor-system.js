import pattern from "./data/hiro.patt";
import sunTexture from "./textures/sun.jpg";
import { planet_data } from "./planets_data";
import * as THREE from "three";
import { THREEx } from "./threex/join";
import { arToolkitContext } from "./ar";
import { diameterScale, distanceScale, secondsInDay, timeScale } from "./base";

const loader = new THREE.TextureLoader();

export class SolarSystem {
  constructor() {
    this.t1 = Date.now() / 1000;
  }

  build() {
    let scene = new THREE.Group();

    let markerControls = new THREEx.ArMarkerControls(arToolkitContext, scene, {
      type: "pattern",
      patternUrl: pattern,
    });

    addSunLinghtTo(scene);
    addAmbientLightTo(scene);
    addSunTo(scene);

    this.planets = computePlanets();

    addPlanetTrajectories(this.planets, scene);
    addPlanets(this.planets, scene);
    return scene;
  }

  animate() {
    var t2 = Date.now() / 1000;
    var dT = (t2 - this.t1) * timeScale;
    this.t1 = t2;

    this.planets.forEach(function (planet) {
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
  }
}
function addPlanets(planets, solarScene) {
  planets.forEach((planet) => {
    solarScene.add(createMeshFrom(planet, planet.distance_KM));
    if (planet.attachment) {
      solarScene.add(
        createMeshFrom(planet.attachment, 1 + planet.diameter + planet.distance_KM + planet.attachment.distance_KM)
      );
    }
  });
}

function addPlanetTrajectories(planets, solarScene) {
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

    solarScene.add(targetTrajectory);
  });
}

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

function computePlanets() {
  var planets = [];
  planet_data.forEach(function (planet) {
    let attachment = null;
    if (planet.attachment) {
      attachment = {
        name: planet.attachment.name,
        theta: 0,
        dTheta: (2 * Math.PI) / (planet.attachment.period_days * secondsInDay),
        diameter: planet.attachment.diameter / diameterScale,
        distance_KM: planet.attachment.distance_KM * distanceScale,
        inclination: planet.attachment.inclination * (Math.PI / 180),
        rotation: (2 * Math.PI) / (planet.attachment.rotation_days * secondsInDay),
        texture: planet.attachment.texture,
      };
    }

    planets.push({
      name: planet.name,
      theta: 0,
      dTheta: (2 * Math.PI) / (planet.period_days * secondsInDay),
      diameter: planet.diameter / diameterScale,
      distance_KM: planet.distance_KM * distanceScale,
      inclination: planet.inclination * (Math.PI / 180),
      rotation: (2 * Math.PI) / (planet.rotation_days * secondsInDay),
      texture: planet.texture,
      attachment: attachment,
    });
  });
  return planets;
}

function addSunTo(solarScene) {
  var sunGeometry = new THREE.SphereGeometry(1, 50, 50);
  var sunMaterial = new THREE.MeshPhongMaterial({
    map: loader.load(sunTexture),
    color: 0xf2e8b7,
    emissive: 0x91917b,
    specular: 0x777d4a,
    shininess: 0,
  });
  var sunObject = new THREE.Mesh(sunGeometry, sunMaterial);
  solarScene.add(sunObject);
}

function addAmbientLightTo(solarScene) {
  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  solarScene.add(ambientLight);
}

function addSunLinghtTo(solarScene) {
  var sunLight = new THREE.PointLight(0xffffff);
  sunLight.position.set(0, 0, 0);
  solarScene.add(sunLight);
}
