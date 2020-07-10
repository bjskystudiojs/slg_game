import BaseButton from "../core/BaseButton";
import MainResUI from "./main/MainResUI";
import { BaseComp } from "../core/BaseComp";
import { Scene, SceneEnum } from "../manager/SceneManager";
import { ResConst } from "../const/ResConst";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends BaseComp {

    @property(BaseButton)
    btnTask: BaseButton = null;
    @property(BaseButton)
    btnBag: BaseButton = null;
    @property(BaseButton)
    btnHero: BaseButton = null;
    @property(BaseButton)
    btnAlliance: BaseButton = null;
    @property(BaseButton)
    btnMail: BaseButton = null;
    @property(BaseButton)
    btnOther: BaseButton = null;
    @property(BaseButton)
    btnWorld: BaseButton = null;
    @property(cc.Node)
    subUINode: cc.Node = null;
    @property([cc.Node])
    resUIArr: Array<cc.Node> = [];


    private _uiContentNode:cc.Node =null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {


    }

    start () {

    }

    public init(){
        //
        let sceneType = Scene.currentScene.name;
        let uiContentPath ="";
        if(sceneType == SceneEnum.CityScene){
            uiContentPath = ResConst.MainCityUI;
        }else if(sceneType == SceneEnum.WorldScene){
            uiContentPath = ResConst.WorldUI;
        }
        this.loadPrefab(uiContentPath,(node:cc.Node)=>{
            this._uiContentNode = node;
            this.subUINode.addChild(node);
        })
    }

    onDispose(){
        super.onDispose();
        this._uiContentNode.getComponent(BaseComp).dispose();
    }

    // update (dt) {}
}
