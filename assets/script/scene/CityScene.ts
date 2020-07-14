import DragableScene from "../core/DragableScene";
import CityMap from "./CityMap";
import MainUI from "../view/MainUI";
import MainCityUI from "../view/MainCityUI";
import LinkPrefab from "../core/LinkPrefab";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityScene extends DragableScene {
    @property(cc.Node)
    uiLayer:cc.Node = null;
    @property(LinkPrefab)
    mainCityUILink:LinkPrefab = null;

    onInit() {
        super.onInit();
        this._map = this.mapLayer.getComponent(CityMap);
        this._map.initMap();

        this._mainUI = this.uiLayer.getComponent(MainUI);
        this._mainUI.init();
        this._maincityUI = this.mainCityUILink.getPrefabComponect(MainCityUI);
        
    }

    private _map:CityMap;

    private _mainUI:MainUI;
    private _maincityUI:MainCityUI;

    onDispose() {
        super.onDispose();
        this._map.dispose();
        if(this._mainUI){
            this._mainUI.dispose();
        }
        if(this._maincityUI){
            this._maincityUI.dispose();
        }
    }
}