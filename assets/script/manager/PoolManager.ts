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

    private getPool(type:PoolTypeEnum):BasePool{
        let pool:BasePool;
        switch(type){
            case PoolTypeEnum.PoolNode:
                pool = this._pool_node;
                break;
            case PoolTypeEnum.PoolUI:
                pool = this._pool_ui;
                break;
            default:
                pool = this._pool_node;
                break;
        }
        return pool;
    }

    /**
     * 从对象池取出预制界面实例
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawn(type:PoolTypeEnum,path:string,cb:Function,...params:any[]){
        let pool = this.getPool(type);
        pool.requestNode(path,(node:cc.Node)=>{
            let b = node.getComponent(BaseComp);
            if(!b)
            {
                b = node.addComponent(BaseComp);
            }
            b.path = path;
            b.pooltype = type;
            b.init(...params)
            if(b instanceof BaseDialog){
                b.onShow();
            }
            cb && cb(node);
        });
    }

    public unspawn(node:cc.Node){
        var b:BaseComp = node.getComponent(BaseComp);
        if(b && b.path && b.pooltype){
            let pool = this.getPool(b.pooltype);
            if(b instanceof BaseDialog){
                b.onHide(()=>{
                    b.dispose();
                    pool.returnNode(b.path,node);
                });
            }else{
                b.dispose();
                pool.returnNode(b.path,node);
            }
        }else{
            LogUtils.warn(this,"node unspawn failed,is not a baseComponent.");
        }
    }

    /**
     * 清空对象池
     */
    public clear(){
        for(let i=1;i<=PoolTypeEnum.PoolUI;i++)
        {
            var pool = this.getPool(i);
            if(pool){
                pool.clear();
            }
        }
    }


    public dump():void{
        let str:string = "******** POOL dump ********\n";
        LogUtils.log(this,str);
        var size:number = 0;
        for(let i=1;i<=PoolTypeEnum.PoolUI;i++)
        {
            var pool = this.getPool(i);
            if(pool){
                let poolname:PoolTypeEnum = PoolTypeEnum[i] as any;
                LogUtils.log(this,'>>>>>>> '+poolname+' <<<<<<\n');
                pool.dump();
                size += pool.countSize();
            }
        }
        LogUtils.log(this,'******** total size:'+size+' ********\n');
    }
}

export enum PoolTypeEnum{
    PoolNode = 1,
    PoolUI = 2,
}

export var Pool = PoolManager.getInstance();