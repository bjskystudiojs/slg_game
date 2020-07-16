import { SceneEnum } from "../manager/SceneManager";
import LogUtils from "../utils/LogUtils";
import { Dialog } from "../manager/DialogManager";
import { BaseComp } from "./BaseComp";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseScene extends BaseComp {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        //设置适配策略
        this.setPortrait();

    }

    public name:SceneEnum;

    /**
     * 切换场景动画完成
     */
    public show(){

    }

    onDestroy(){
        //清除对象池
        Dialog.dumpPool();
        Dialog.clearPool();
        LogUtils.log(this,"scene onDestoryed:pool clear");
    }

    private setPortrait(){
        let cavas: cc.Canvas = this.node.getComponent(cc.Canvas);
        //frame 尺寸
        let f_width = cc.view.getFrameSize().width;
        let f_height = cc.view.getFrameSize().height;
        //设计分辨率
        let d_width = cavas.designResolution.width;
        let d_height = cavas.designResolution.height;
        //屏幕尺寸
        let winSize = cc.winSize;
        LogUtils.log(this,'-----web0-----', cc.sys.isBrowser, cc.sys.isMobile, cc.sys.isNative, d_width, d_height);
        LogUtils.log(this,'-----web1-----', f_width, f_height, winSize.width, winSize.height);

    }

    // update (dt) {}
}
