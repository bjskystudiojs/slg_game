import BasePool from "../BasePool";

/**
 * 单个对象池 by liuxin
 */
export default class UIPool extends BasePool{
    //ui缓存的总数
    private _maxSize:number = 0;
    private _poolKeys:Array<string> = [];
    constructor(size:number){
        super();
        this._maxSize = size;
    }

    protected getNode(path:string):cc.Node{
        if(!this._pools[path]){
            this._pools[path] = new cc.NodePool();
            this._poolKeys.push(path);
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
        var size = this.countSize();
        if(size>=this._maxSize){  //多的释放
            var delKey = this._poolKeys[0];
            if(this._pools[delKey].size()>0){
                var delNode:cc.Node = this._pools[delKey].get();
                delNode.destroy();
            }else{
                this._pools[delKey].clear();
                delete this._pools[delKey];
                this._poolKeys.shift();
            }
            this.putNode(path,node);
        }else{
            let pool = this._pools[path];
            if(cc.isValid(node)){
                pool.put(node);
            }
        }
    }
}