import DragableScene from "../core/DragableScene";
import CityMap from "./CityMap";
import MainUI from "../view/MainUI";
import { Scene, LayerEnum } from "../manager/SceneManager";
import { NodeMng } from "../manager/NodeManager";
import { ResConst } from "../const/ResConst";

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

        let uiLayer = Scene.getLayer(LayerEnum.UILayer);
        NodeMng.spawn(ResConst.MainUI,(ui:cc.Node)=>{
            this._mainUI = ui.getComponent(MainUI);
            uiLayer.addChild(ui);
        });
    }

    private _map: CityMap;

    private _mainUI:MainUI;

    public dispose() {
        super.dispose();
        this._map.dispose();
        if(this._mainUI){
            this._mainUI.dispose();
        }
    }
}