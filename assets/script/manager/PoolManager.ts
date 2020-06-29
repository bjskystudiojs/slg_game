import BasePool from "../core/BasePool";
import BaseComp from "../core/BaseComp";
import { ResConst } from "../const/ResConst";
import LogUtils from "../utils/LogUtils";
import BaseDialog from "../core/BaseDialog";
import UIPool from "../core/pool/UIPool";

/**
 * 对象池管理 by liuxin
 */
export default class PoolManager{

    private static _instance:PoolManager;
    public static getInstance():PoolManager{
        if(!this._instance){
            this._instance = new PoolManager();
        }
        return this._instance;
    }

    private _pool_ui:UIPool = new UIPool(4);
    private _pool_node:BasePool = new BasePool();

    /**
     * 从对象池取出预制界面实例
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawnUI(path:string,cb:Function,...params:any[]){
        this._pool_ui.requestNode(path,(node:cc.Node)=>{
            let b = node.getComponent(BaseComp);
            if(!b)
            {
                b = node.addComponent(BaseComp);
            }
            b.path = path;
            b.init(...params)
            if(b instanceof BaseDialog){
                b.onShow();
            }
            cb && cb(node);
        });
    }

    public unspawnUI(node:cc.Node){
        var b:BaseComp = node.getComponent(BaseComp);
        if(b && b.path){
            if(b instanceof BaseDialog){
                b.onHide(()=>{
                    b.dispose();
                    this._pool_ui.returnNode(b.path,node);
                });
            }else{
                b.dispose();
                this._pool_ui.returnNode(b.path,node);
            }
        }else{
            LogUtils.warn(this,"node unspawn failed,is not a baseComponent.");
        }
    }

}

export var Pool = PoolManager.getInstance();