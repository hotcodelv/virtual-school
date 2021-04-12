import { renderer, scene, camera } from "./base";
import { SolarSystem } from "./solor-system";
import { arToolkitSource, arToolkitContext } from "./ar";
import { qr_planet_data } from "./planets_data";
import { Planet } from "./planet";

function init() {
  var sol = new SolarSystem();
  var solScene = sol.build();
  scene.add(solScene);

  var oneByOnePlanets = [];
  qr_planet_data.forEach((p) => {
    let planet = new Planet(p.texture, p.pattern);
    let planetScene = planet.build();
    let contex = { planet, planetScene };
    scene.add(contex.planetScene);

    oneByOnePlanets.push(contex);
  });

  document.body.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);

    if (solScene.visible === true) {
      sol.animate();
    }

    oneByOnePlanets.forEach((c) => {
      if (c.planetScene.visible === true) {
        c.planet.animate();
      }
    });

    if (arToolkitSource.ready !== false) {
      arToolkitContext.update(arToolkitSource.domElement);
    }
    renderer.render(scene, camera);
  }

  animate();
}

init();
