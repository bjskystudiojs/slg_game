import BaseDialog from "../../core/BaseDialog";
import LinkPrefab from "../../core/LinkPrefab";
import DialogBGView from "../DialogBGView";
import { Language } from "../../manager/LanguageManager";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ConstructDialog extends BaseDialog {

    @property(LinkPrefab)
    bgLink: LinkPrefab = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    private dialogBG:DialogBGView = null;

    onInit(){
        super.onInit();
        this.dialogBG = this.bgLink.getPrefabComponect(DialogBGView);
        this.dialogBG.labelTitle.string = Language.getString("ConstructTitle");
        this.dialogBG.setBackTarget(this);
    }

    onDispose(){
        super.onDispose();
        this.dialogBG.dispose();
    }
}
