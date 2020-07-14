import DragableScene from "../core/DragableScene";
import LinkPrefab from "../core/LinkPrefab";
import WorldUI from "../view/WorldUI";
import MainUI from "../view/MainUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorldScene extends DragableScene {

    @property(cc.Node)
    uiLayer:cc.Node = null;
    @property(LinkPrefab)
    worldUILink:LinkPrefab = null;

    onInit() {
        super.onInit();
        this._mainUI = this.uiLayer.getComponent(MainUI);
        this._mainUI.init();
        this._worldUI = this.worldUILink.getPrefabComponect(WorldUI);
        
    }
    private _mainUI:MainUI;
    private _worldUI:WorldUI;

    onDispose() {
        super.onDispose();
        if(this._mainUI){
            this._mainUI.dispose();
        }
        if(this._worldUI){
            this._worldUI.dispose();
        }
    }
}