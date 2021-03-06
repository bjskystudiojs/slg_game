import BaseButton from "../core/BaseButton";
import PopupDialog from "./PopupDialog";
import { Language } from "../manager/LanguageManager";
import { TouchTypeEnum } from "../core/TouchDelegate";
import { Scene } from "../manager/SceneManager";
import LoadingScene from "../scene/LoadingScene";
import LinkPrefab from "../core/LinkPrefab";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MessageBoxDialog extends PopupDialog {
    public static instance:number=0;

    @property(cc.Label)
    public lblTitle: cc.Label = null;
    @property(cc.Label)
    public lblText: cc.Label = null;
    @property(LinkPrefab)
    public btnYesLink: LinkPrefab = null;
    @property(LinkPrefab)
    public btnNoLink: LinkPrefab = null;

    private btnYes:BaseButton = null;
    private btnNo:BaseButton = null;

    private _title: string = "";
    private _content: string = "";
    protected onInit(title: string, content: string, type: MessageBoxTypeEnum = MessageBoxTypeEnum.YesOnly) {
        this._title = title;
        this._content = content;

        this.initLinkPrefabs();
        this.initDialog();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // }

    public touchClick() {

        var scene = Scene.currentScene as LoadingScene;
        if (scene && scene.mLoading) {
            scene.mLoading.startLoading();
        }
        this.close();
    }
    public touchClose(){
        this.close();
    }

    private initLinkPrefabs(){
        this.btnYes = this.btnYesLink.getPrefabComponect(BaseButton);
        this.btnNo = this.btnNoLink.getPrefabComponect(BaseButton);
    }

    public initDialog() {
        this.lblTitle.string = this._title;
        this.lblText.string = this._content;

        this.btnYes.setString(Language.getString("comfirmBtn"));
        this.btnNo.setString(Language.getString("cancelBtn"));
        this.btnYes.addTouchHandler(TouchTypeEnum.TouchClick,this.touchClick.bind(this));
        this.btnNo.addTouchHandler(TouchTypeEnum.TouchClick,this.touchClose.bind(this));

    }

    onDispose(){
        this.btnYes.removeTouchHandler(TouchTypeEnum.TouchClick);
        this.btnNo.removeTouchHandler(TouchTypeEnum.TouchClick);
        this.btnYes.dispose();
        this.btnNo.dispose();
    }

    // start() {
        
    // }

    // update (dt) {}
}


export enum MessageBoxTypeEnum {
    YesOnly = "YesOnly",
    YesOrNo = "YesOrNo",
}