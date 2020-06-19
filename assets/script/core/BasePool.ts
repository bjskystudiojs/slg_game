import { RES } from "../manager/ResourceManager";

/**
 * 单个对象池 by liuxin
 */
export default class BasePool {
    private _pool:cc.NodePool = null;
    private _path:string = "";

    public constructor(path?:string,poolHandler?:string){
        this._pool = new cc.NodePool(poolHandler);
        this._path = path;
    }

    private getNode():cc.Node{
        if(this._pool.size()>0){
            let node = this._pool.get();
            if(!cc.isValid(node)){
                return this.getNode();
            }
            return node;
        }else{
            return null;
        }
    }

    private putNode(node:cc.Node){
        if(cc.isValid(node)){
            this._pool.put(node);
        }
    }

    public requestNode(cb:Function){
        let node = this.getNode();
        if(node){
            node.active = true;
            cb && cb(node);
            return;
        }
        RES.loadAsset(this._path,cc.Prefab,(obj)=>{
            node = cc.instantiate(obj);
            node.active = true;
            cb && cb(node);
        })
    }

    public returnNode(node:cc.Node){
        node.active = false;
        if(node.parent){
            node.removeFromParent();
        }
        this.putNode(node);
    }
}