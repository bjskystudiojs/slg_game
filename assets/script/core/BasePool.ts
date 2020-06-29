import { RES } from "../manager/ResourceManager";

/**
 * 单个对象池 by liuxin
 */
export default class BasePool {
    protected _pools:any = {}; //key=>NodePool

    protected getNode(path:string):cc.Node{
        if(!this._pools[path]){
            this._pools[path] = new cc.NodePool();
            return null;
        }

        let pool = this._pools[path];
        if(pool.size()>0){
            let node = pool.get();
            if(!cc.isValid(node)){
                return this.getNode(path);
            }
            return node;
        }else{
            return null;
        }
    }

    protected putNode(path:string,node:cc.Node){
        if(!this._pools[path]){
            return;
        }
        let pool = this._pools[path];
        if(cc.isValid(node)){
            pool.put(node);
        }
    }

    public requestNode(path:string,cb:Function){
        let node = this.getNode(path);
        if(node){
            node.active = true;
            cb && cb(node);
            return;
        }
        RES.loadAsset(path,cc.Prefab,(obj)=>{
            node = cc.instantiate(obj);
            node.active = true;
            cb && cb(node);
        })
    }

    public returnNode(path:string,node:cc.Node){
        node.active = false;
        if(node.parent){
            node.removeFromParent();
        }
        this.putNode(path,node);
    }
}