import DragableScene from "../core/DragableScene";
import CityMap from "./CityMap";
import MainUI from "../view/MainUI";
import { Scene, LayerEnum } from "../manager/SceneManager";
import { ResConst } from "../const/ResConst";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityScene extends DragableScene {
    @property(cc.Node)
    uiLayer:cc.Node = null;

    public init() {
        super.init();

        this._map = this.mapLayer.getComponent(CityMap);
        this._map.initMap();

        // let uiLayer = Scene.getLayer(LayerEnum.UILayer);
        // this.loadPrefab(ResConst.MainUI,(ui:cc.Node)=>{
        //     this._mainUI = ui.getComponent(MainUI);
        //     uiLayer.addChild(ui);
        // });
        this._mainUI = this.uiLayer.getComponent(MainUI);
        this._mainUI.init();
    }

    private _map: CityMap;

    private _mainUI:MainUI;

    onDispose() {
        super.onDispose();
        this._map.dispose();
        if(this._mainUI){
            this._mainUI.dispose();
        }
    }
}