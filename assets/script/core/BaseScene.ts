import { Pool } from "../manager/PoolManager";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseScene extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    /**
     * 初始化场景
     */
    public init(){

    }
    
    /**
     * 主动卸载场景
     */
    public dispose(){

    }

    onDestroy(){
        //清除对象池
        Pool.clear();
    }

    // update (dt) {}
}
