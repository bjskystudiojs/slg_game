import BaseButton from "../core/BaseButton";
import { BaseComp } from "../core/BaseComp";
import { TouchTypeEnum } from "../core/TouchDelegate";
import { Scene, SceneEnum } from "../manager/SceneManager";

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
    @property([cc.Node])
    resUIArr: Array<cc.Node> = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnWorld.addTouchHandler(TouchTypeEnum.TouchClick,this.onWorldClick.bind(this));
    }

    private onWorldClick(){
        if(Scene.currentScene.name == SceneEnum.CityScene){
            Scene.changeTo(SceneEnum.WorldScene);
        }else if(Scene.currentScene.name == SceneEnum.WorldScene){
            Scene.changeTo(SceneEnum.CityScene);
        }
    }

    start () {

    }

    onDispose(){
        super.onDispose();
    }

    // update (dt) {}
}
