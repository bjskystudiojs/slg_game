import LogUtils from "../utils/LogUtils";
import { isString } from "../utils/CommonUtil";

/**
 * 资源管理 by liuxin
 */
export default class ResourceManager{

    private static _instance:ResourceManager;
    public static getInstance():ResourceManager{
        if(!this._instance){
            this._instance = new ResourceManager();
        }
        return this._instance;
    }
    //资源计数
    private persist: {[index:string]: number}={};

    /** 对asset所关联的资源进行计数 */
    countAsset(asset):void{
        
        var deps = cc.loader.getDependsRecursively(asset);
        let self = this;
        for (let index = 0; index < deps.length; index++) {
            const element = deps[index];
            if(self.persist[element])
            {
                // let num = self.persist[element];
                self.persist[element]++;
            }
            else{
                self.persist[element]=1;
            }
        }
    }

    public loadAsset(path:string,type:typeof cc.Asset,cb:Function):any{
        let res:any = cc.loader.getRes(path, type);
        if(res){
            this.countAsset(res);
            cb && cb(res);
            return;
        }
        cc.loader.loadRes(path, type, (err:any, res:any):void=>{
            if(err)
            {
                cc.warn("[ResourceManager]loadAsset error", path);
                return;
            }
            this.countAsset(res);
            cb && cb(res);
        });
    }

    /**
     * 
     * @param res 
     */
    private releaseRes(res) {
        var deps = cc.loader.getDependsRecursively(res);
        for (let i = 0; i < deps.length; ++i) {
            var persistDep = this.persist[deps[i]];
            if(!persistDep || --persistDep < 1) {
                cc.loader.release(deps[i]);
                delete this.persist[deps[i]];
                continue;
            }
            this.persist[deps[i]]=persistDep;
        }
        
    }

    /**
     * 释放资源
     * @param urlOrAssetOrNode 
     */
    release(urlOrAssetOrNode:any):void
    {
        if(urlOrAssetOrNode instanceof cc.Node)
        {
            //释放节点,从场景上移除
            urlOrAssetOrNode.destroy();
        }
        // native instanceof extends invalid ? :w_l_hikaru
        else if(urlOrAssetOrNode instanceof cc.Asset || urlOrAssetOrNode instanceof cc.SpriteFrame || urlOrAssetOrNode instanceof cc.Prefab
        || urlOrAssetOrNode instanceof cc.AnimationClip)
        {
            this.releaseRes(urlOrAssetOrNode);
            
        }
        else if (isString(urlOrAssetOrNode)){
            let prefab = cc.loader.getRes(urlOrAssetOrNode);
            if(prefab)
                this.releaseRes(prefab);
        }
        else
        {
            let asset = cc.loader.getRes(urlOrAssetOrNode);
            if(asset){
                this.releaseRes(asset);
            }
            
        }
    }

    public dump():void{
        let str:string = "******** RES dump ********\n";
        LogUtils.log(this,str);
        let count =0;
        for(let key in this.persist)
        {
            count+=this.persist[key];
            LogUtils.log(this,'key:'+key+',count:'+this.persist[key]+'\n');
        }
        LogUtils.log(this,'******** total:'+count+'\n');
    }
    
}

export var RES = ResourceManager.getInstance();