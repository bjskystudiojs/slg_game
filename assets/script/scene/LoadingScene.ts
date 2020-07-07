import BaseScene from "../core/BaseScene";
import { Config } from "../manager/ConfigManager";
import BaseButton from "../core/BaseButton";
import { GlobalConst } from "../const/GlobalConst";
import LogUtils from "../utils/LogUtils";
import LanguageManager, { Language } from "../manager/LanguageManager";
import { Dialog } from "../manager/DialogManager";
import { Scene, SceneEnum } from "../manager/SceneManager";
import { Emitter } from "../core/Emitter";
import LoadingModule from "../module/LoadingModule";
import { Module } from "../manager/ModuleManager";
import { TouchTypeEnum } from "../core/TouchDelegate";
import { ResConst } from "../const/ResConst";

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
    @property(cc.Label)
    lblLoadingTip: cc.Label = null;
    @property(cc.ProgressBar)
    proLoading: cc.ProgressBar = null;

    public mLoading: LoadingModule;

    start() {
        LogUtils.isOpen = true;
        LogUtils.showTarget = true;
        LogUtils.log(this, "##gamestart!", "test")

        this.name  = SceneEnum.LoadingScene;
        Scene.setFirstScene(this);
        this.initGame();

    }

    private initGame() {
        let uiRoot: cc.Node = cc.find(GlobalConst.UI_Root_Canvas);
        Scene.initLayers(uiRoot);
        Config.initServer();
        Module.init();
        Language.init();
        Emitter.on(LanguageManager.Event_Language_Loaded, this.startGame.bind(this), this);
        Emitter.on(LoadingModule.Event_Loading_complete, this.enterGame.bind(this), this);
        Emitter.on(LoadingModule.Event_Loading_TipChange, this.onTipChange.bind(this), this);
        Emitter.on(LoadingModule.Event_Loading_progress, this.onProgress.bind(this), this);
        //加个加载逻辑组件
        this.mLoading = this.node.addComponent(LoadingModule);
        this.btnlogin.node.active = false;
        this.lblLoadingTip.string = "";
        this.proLoading.progress = 0;
    }
    private startGame() {
        Emitter.off(LanguageManager.Event_Language_Loaded, this.startGame.bind(this), this);
        this.btnlogin.node.active = true;
        this.btnlogin.setString(Language.getString("loginBtn"));
        this.btnlogin.addTouchHandler(TouchTypeEnum.TouchClick,this.onBtnLoginClick.bind(this));
    }

    //进入主场景
    private enterGame() {
        Emitter.off(LoadingModule.Event_Loading_complete, this.enterGame.bind(this), this);
        this.mLoading.dispose();
        Dialog.removeAll();
        Scene.changeTo(SceneEnum.CityScene);
    }

    private onTipChange(evt,tipstr) {
        this.lblLoadingTip.string = tipstr;
    }

    private onProgress(evt,pro){
        this.proLoading.progress = pro;
    }

    private onBtnLoginClick() {
        //后面封装成pool
        let title:string  = Language.getString("tipTitle")
        let content:string = Language.getString("tipContentTest","test");
        Dialog.showDialog(ResConst.MessageBoxDialog, title, content);
    }

    update(dt) {


    }

    public dispose() {
        Emitter.off(LoadingModule.Event_Loading_TipChange, this.onTipChange.bind(this), this);
        Emitter.off(LoadingModule.Event_Loading_progress, this.onProgress.bind(this), this);
        this.btnlogin.removeAllHandler();
    }
}
