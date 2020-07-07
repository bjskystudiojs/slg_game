import DragableScene from "../core/DragableScene";
import CityMap from "./CityMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityScene extends DragableScene {
    public init() {
        super.init();

        this._map = this.mapLayer.getComponent(CityMap);
        if (!this._map) {
            this._map = this.mapLayer.addComponent(CityMap);
        }
        this._map.initMap();
    }

    private _map: CityMap;

    public dispose() {
        super.dispose();
        this._map.dispose();
    }
}