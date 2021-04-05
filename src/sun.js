import * as THREE from "three";

export const sunLight = new THREE.PointLight(0xffffff);
sunLight.position.set(0, 0, 0);

const loader = new THREE.TextureLoader();
const texture = loader.load(startTexture);

const geometry = new THREE.SphereGeometry(1, 50, 50);
const meterial = new THREE.MeshPhongMaterial({
  map: texture,
  color: 0xf2e8b7,
  emissive: 0x91917b,
  specular: 0x777d4a,
  shininess: 62,
  envMaps: "refraction",
});
export const sun = new THREE.Mesh(geometry, meterial);
