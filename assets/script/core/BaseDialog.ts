import { Dialog } from "../manager/DialogManager";
import { BaseComp } from "../manager/NodeManager";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass} = cc._decorator;

@ccclass
export default class BaseDialog extends BaseComp {

    //所在层级
    public _zIndex = 0;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }
    public onShow(cb?:Function){
        cb && cb();
    }

    public onHide(cb?:Function){
        cb && cb();
    }

    //关闭弹窗
    public close(){
        Dialog.closeDialog(this.node);
    }
    // update (dt) {}
}
