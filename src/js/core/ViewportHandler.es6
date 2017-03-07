import EngineComponent from "api/EngineComponent";

export default class ViewportHandler extends EngineComponent {
    get viewport() {
        return {x: 0, y: 0, z: 0}
    }
}
