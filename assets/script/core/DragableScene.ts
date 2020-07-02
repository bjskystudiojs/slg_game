import BaseScene from "./BaseScene";
import TouchDelegate, { TouchTypeEnum } from "./TouchDelegate";
import { RES } from "../manager/ResourceManager";
import { Pool } from "../manager/PoolManager";

const { ccclass, property } = cc._decorator;

/**
 * 可以拖拽的场景
 */
export default class DragableScene extends BaseScene{

    @property(cc.Node)
    touchLayer: cc.Node = null;

    private touchDelegate:TouchDelegate = null;

    public init(){
        super.init();
        this.touchDelegate = new TouchDelegate();
        this.touchDelegate.listen(this.touchLayer);
        this.touchDelegate.addTouchHandler(TouchTypeEnum.TouchClick,this.onTouchClick);
    }

    public onTouchClick(evt){
        Pool.dump();
        RES.dump();
    }

    public dispose(){
        super.dispose();
        this.touchDelegate.unlisten();
        this.touchDelegate.removeAllHandler();
    }
}