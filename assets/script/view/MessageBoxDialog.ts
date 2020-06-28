import BaseButton from "../core/BaseButton";
import PopupDialog from "./PopupDialog";
import LogUtils from "../utils/LogUtils";
import { Dialog } from "../manager/DialogManager";
import { ResConst } from "../const/ResConst";
import { Language } from "../manager/LanguageManager";

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
    @property(BaseButton)
    public btnYes: BaseButton = null;
    @property(BaseButton)
    public btnNo: BaseButton = null;


    private _title: string = "";
    private _content: string = "";
    public init(title: string, content: string, type: MessageBoxTypeEnum = MessageBoxTypeEnum.YesOnly) {
        this._title = title;
        this._content = content;

        this.initDialog();
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // }

    public touchClick() {

        let title:string  = Language.getString("tipTitle")
        let content:string = Language.getString("tipContentTest","test");
        Dialog.showDialog(ResConst.MessageBoxDialog, title, content);
    }
    public touchClose(){
        this.close();
    }

    public initDialog() {
        this.lblTitle.string = this._title;
        this.lblText.string = this._content;

        this.btnYes.setString(Language.getString("comfirmBtn"));
        this.btnNo.setString(Language.getString("cancelBtn"));
        this.btnYes.setTouchClickHandler(this.touchClick.bind(this));
        this.btnNo.setTouchClickHandler(this.touchClose.bind(this));

    }

    public dispose(){
        this.btnYes.dispose();
    }

    // start() {
        
    // }

    // update (dt) {}
}


export enum MessageBoxTypeEnum {
    YesOnly = "YesOnly",
    YesOrNo = "YesOrNo",
}