import BasePool from "../core/BasePool";
import BaseComp from "../core/BaseComp";
import BaseDialog from "../core/BaseDialog";
import LogUtils from "../utils/LogUtils";
import { RES } from "./ResourceManager";

/**
 * 节点管理，by liuxin
 * @desc 通过节点管理统一生成和释放机制
 */
export default class NodeManager{
    private static _instance:NodeManager;
    public static getInstance():NodeManager{
        if(!this._instance){
            this._instance = new NodeManager();
        }
        return this._instance;
    }

    /**
     * 从对象池取出预制界面实例
     * @param pool 对象池
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawnWithPool(pool:BasePool,path:string,cb:Function,...params:any[]){
        pool.requestNode(path,(node:cc.Node)=>{
            let b = node.getComponent(BaseComp);
            if(!b)
            {
                b = node.addComponent(BaseComp);
            }
            b.path = path;
            b.poolRef = pool;
            b.init(...params)
            if(b instanceof BaseDialog){
                b.onShow();
            }
            cb && cb(node);
        });
    }

    /**
     * 创建预制界面实例
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawn(path:string,cb:Function,...params:any[]){
        RES.loadAsset(path,cc.Prefab,(obj)=>{
            let node = cc.instantiate(obj);
            node.active = true;
            let b = node.addComponent(BaseComp);
            b.path = path;
            b.init(...params)
            if(b instanceof BaseDialog){
                b.onShow();
            }
            cb && cb(node);
        })
    }

    public unspawn(node:cc.Node){
        var b:BaseComp = node.getComponent(BaseComp);
        if(b){
            if(b.poolRef){ //从pool中创建的
                if(b instanceof BaseDialog){
                    b.onHide(()=>{
                        b.dispose();
                        b.poolRef.returnNode(b.path,node);
                        b.poolRef = null;
                    });
                }else{
                    b.dispose();
                    b.poolRef.returnNode(b.path,node);
                    b.poolRef = null;
                }
            }else{  //普通的comp
                b.dispose();
                b.destroy();
            }
        }else{
            LogUtils.warn(this,"node unspawn failed,is not a baseComponent.");
        }
    }
}

export var NodeMng:NodeManager = NodeManager.getInstance();