import * as THREE from "three";
import { arToolkitContext } from "./ar";
import { THREEx } from "./threex/join";

const loader = new THREE.TextureLoader();

export class Planet {
  constructor(texture, pattern) {
    this.texture = texture;
    this.pattern = pattern;
  }

  build() {
    let scene = new THREE.Group();

    let markerControls = new THREEx.ArMarkerControls(arToolkitContext, scene, {
      type: "pattern",
      patternUrl: this.pattern,
    });

    addAmbientLightTo(scene);
    addSunLinghtTo(scene);

    const texture = loader.load(this.texture);
    const geometry = new THREE.SphereGeometry(0.5, 50, 50);
    const meterial = new THREE.MeshPhongMaterial({
      map: texture,
    });

    this.mesh = new THREE.Mesh(geometry, meterial);
    scene.add(this.mesh);

    return scene;
  }

  animate() {
    this.mesh.rotation.y += 0.01;
  }
}

function addAmbientLightTo(solarScene) {
  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
  solarScene.add(ambientLight);
}

function addSunLinghtTo(solarScene) {
  var sunLight = new THREE.PointLight(0xffffff);
  sunLight.position.set(10, 0, 0);
  solarScene.add(sunLight);
}
