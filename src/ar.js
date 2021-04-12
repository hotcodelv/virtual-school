import camera_para from "./data/camera_para.dat";
import { camera, renderer } from "./base";
import { THREEx } from "./threex/join";

var arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: camera_para,
  detectionMode: "mono",
});

arToolkitContext.init(function onCompleted() {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

var arToolkitSource = new THREEx.ArToolkitSource({
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

window.addEventListener("resize", function () {
  onResize();
});

export { arToolkitSource, arToolkitContext };
