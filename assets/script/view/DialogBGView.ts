import { BaseComp } from "../core/BaseComp";
import BaseButton from "../core/BaseButton";
import { TouchTypeEnum } from "../core/TouchDelegate";
import { Dialog } from "../manager/DialogManager";
import BaseDialog from "../core/BaseDialog";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogBGView extends BaseComp {

    @property(cc.Label)
    labelTitle: cc.Label = null;
    @property(BaseButton)
    btnClose: BaseButton = null;
    @property(BaseButton)
    btnBack: BaseButton = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
    private _backTarget:BaseDialog = null;
    public setBackTarget(dialog:BaseDialog){
        this._backTarget = dialog;
    }
    onInit(){
        super.onInit();
        this.btnClose.addTouchHandler(TouchTypeEnum.TouchClick,this.onBtnCloseClick.bind(this));
        this.btnBack.addTouchHandler(TouchTypeEnum.TouchClick,this.onBtnBackClick.bind(this));
        
    }

    private onBtnCloseClick(){
        Dialog.removeAll();
    }

    private onBtnBackClick(){
        if(this._backTarget){
            Dialog.closeDialog(this._backTarget.node);
        }else{
            if(this.node.parent){
                //背景组件挂载在dialog根节点之下
                let pDialog:BaseDialog = this.node.parent.getComponent(BaseDialog);
                pDialog && Dialog.closeDialog(pDialog.node);
            }
        }
    }

    onDispose(){
        super.onDispose();
        this.btnClose.removeAllHandler();
        this.btnBack.removeAllHandler();
    }
}
