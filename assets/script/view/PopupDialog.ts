import BaseDialog from "../core/BaseDialog";
import LogUtils from "../utils/LogUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupDialog extends BaseDialog {

    // LIFE-CYCLE CALLBACKS:

    public onShow(){
        this.node.scale = 0.8;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 1).easing(cc.easeElasticOut(1)),
            cc.callFunc(()=>{
                this.popupShowFinish();
            })
        ));
    }

    public popupShowFinish(){
        LogUtils.log(this,"popupShowFinish");
    }

    start () {

    }
    
    // update (dt) {}
}