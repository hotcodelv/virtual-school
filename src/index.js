import { renderer, scene, camera } from "./base";
import { SolarSystem } from "./solor-system";
import { arToolkitSource, arToolkitContext } from "./ar";

function init() {
  var sol = new SolarSystem();
  var solScene = sol.build();

  document.body.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);

    if (solScene.visible === true) {
      sol.animate();
    }

    if (arToolkitSource.ready !== false) {
      arToolkitContext.update(arToolkitSource.domElement);
    }
    renderer.render(scene, camera);
  }

  animate();
}

init();
