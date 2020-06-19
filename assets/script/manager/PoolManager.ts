import BasePool from "../core/BasePool";
import BaseComp from "../core/BaseComp";
import { ResConst } from "../const/ResConst";
import LogUtils from "../utils/LogUtils";
import BaseDialog from "../core/BaseDialog";

/**
 * 对象池管理 by liuxin
 */
export default class PoolManager{

    private static _instance:PoolManager;
    public static getInstance():PoolManager{
        if(!this._instance){
            this._instance = new PoolManager();
            // this._instance.initHandler();
        }
        return this._instance;
    }

    //注册unuse/reuse logic.
    // public initHandler(){
    //     this.registerHandler(ResConst.MessageBoxDialog,"MessageBoxDialog");
    // }

    private _pools:any = {};
    // private _poolHandlers:any = {};

    // /**
    //  * 注册预制界面的回收复用逻辑组件
    //  * @param path 路径
    //  * @param handler 逻辑组件
    //  */
    // public registerHandler(path:string,handler:string){
    //     this._poolHandlers[path] = handler;
    // }

    /**
     * 从对象池取出预制界面实例
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawn(path:string,cb:Function,...params:any[]){
        let pool:BasePool = this._pools[path];
        if(!pool){
            // let handler = this._poolHandlers[path]?this._poolHandlers[path]:null;
            // pool = new BasePool(path,handler);
            pool = new BasePool(path);
            this._pools[path] = pool;
        }
        pool.requestNode((node:cc.Node)=>{
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

    public unspawn(node:cc.Node){
        var b:BaseComp = node.getComponent(BaseComp);
        if(b && b.path){
            let pool:BasePool = this._pools[b.path];
            if(pool){
                if(b instanceof BaseDialog){
                    b.onHide(()=>{
                        b.dispose();
                        pool.returnNode(node);
                    });
                }else{
                    b.dispose();
                    pool.returnNode(node);
                }
            }else{
                LogUtils.warn(this,"node unspawn failed,not has a pool:",b.path);
            }
        }else{
            LogUtils.warn(this,"node unspawn failed,is not a baseComponent.");
        }
    }

}

export var Pool = PoolManager.getInstance();