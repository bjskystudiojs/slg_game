import BaseScene from "../core/BaseScene";
import { Config } from "../manager/ConfigManager";
import BaseButton from "../core/BaseButton";
import { ResConst } from "../const/ResConst";
import { GlobalConst } from "../const/GlobalConst";
import LogUtils from "../utils/LogUtils";
import LanguageManager, { Language } from "../manager/LanguageManager";
import { Dialog } from "../manager/DialogManager";
import { Net } from "../manager/NetManager";
import { Scene } from "../manager/SceneManager";
import { Emitter } from "../core/Emitter";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingScene extends BaseScene {

    @property(BaseButton)
    btnlogin: BaseButton = null;

    start() {
        LogUtils.isOpen = true;
        LogUtils.showTarget = true;
        LogUtils.log(this,"##gamestart!","test")

        this.initGame();

    }

    private initGame() {
        let uiRoot: cc.Node = cc.find(GlobalConst.UI_Root_Canvas);
        Scene.initLayers(uiRoot);
        Config.init();
        Net.init();
        Language.init();
        Emitter.on(LanguageManager.Event_Language_Loaded,this.startGame.bind(this),this);


        this.btnlogin.node.active = false;
    }
    private startGame(){
        this.btnlogin.node.active = true;
        this.btnlogin.setString(Language.getString("loginBtn"));
        this.btnlogin.setTouchClickHandler(this.onBtnLoginClick);
    }

    private onBtnLoginClick() {
        //后面封装成pool
        let title:string  = Language.getString("tipTitle")
        let content:string = Language.getString("tipContentTest","test");
        Dialog.showDialog(ResConst.MessageBoxDialog, title, content);
    }
    // update (dt) {}
}
