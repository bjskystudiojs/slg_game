import LogUtils from "../utils/LogUtils";
import { isString } from "../utils/CommonUtil";
import { SceneEnum } from "./SceneManager";

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
    private countAsset(asset):void{
        if(asset instanceof cc.Prefab ||asset instanceof cc.SpriteFrame
            ||asset instanceof cc.AnimationClip 
            ){
                asset.addRef();
            // var deps = cc.loader.getDependsRecursively(asset);
            // let self = this;
            // for (let index = 0; index < deps.length; index++) {
            //     const element = deps[index];
            //     if(self.persist[element])
            //     {
            //         // let num = self.persist[element];
            //         self.persist[element]++;
            //     }
            //     else{
            //         self.persist[element]=1;
            //     }
            // }
        }
    }
    /**
     * 切换场景的时候底层已经做了增加引用
     * @param scene 
     */
    public countSceneAsset(scene:cc.Scene){
        // let deps = scene['dependAssets'];
        // if(!deps) return;
        // for (var i = 0; i < deps.length; ++i) {
        //     if(this.persist[deps[i]])
        //     {
        //         // let num = this.persist[element];
        //         this.persist[deps[i]]++;
        //     }
        //     else{
        //         this.persist[deps[i]]=1;
        //     }
        // }
    }

    public loadAsset(path:string,type:typeof cc.Asset,cb:Function):any{
        let res:any = cc.resources.get(path, type);
        if(res){
            this.countAsset(res);
            cb && cb(res);
            return;
        }
        cc.resources.load(path, type, (err:any, res:any):void=>{
            if(err)
            {
                cc.warn("[ResourceManager]loadAsset error", path);
                cb && cb(null,err);
                return;
            }
            this.countAsset(res);
            cb && cb(res);
        });
    }

    public loadScene(sceneName:SceneEnum,cb:Function){
        cc.director.loadScene(sceneName,(err, scene)=>{
            if(err){
                LogUtils.error(this,"loadScene failed,message:"+err.message);
                return;
            }
            this.countSceneAsset(scene);
            cb && cb();
        });
    }

    public releaseSceneAsset(deps:any){
        // for (let i = 0; i < deps.length; ++i) {
        //     var persistDep = this.persist[deps[i]];
        //     if(!persistDep || --persistDep < 1) {
        //         cc.loader.release(deps[i]);
        //         delete this.persist[deps[i]];
        //         continue;
        //     }
        //     this.persist[deps[i]]=persistDep;
        // }
        
    }

    /**
     * 
     * @param res 
     */
    private releaseRes(asset) {
        if(asset instanceof cc.Prefab ||asset instanceof cc.SpriteFrame
            ||asset instanceof cc.AnimationClip 
            ){
                asset.decRef();
                asset = null;
        }
        // var deps = cc.loader.getDependsRecursively(res);
        // for (let i = 0; i < deps.length; ++i) {
        //     var persistDep = this.persist[deps[i]];
        //     if(!persistDep || --persistDep < 1) {
        //         cc.loader.release(deps[i]);
        //         delete this.persist[deps[i]];
        //         continue;
        //     }
        //     this.persist[deps[i]]=persistDep;
        // }
        
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
            let prefab = cc.resources.get(urlOrAssetOrNode);
            if(prefab)
                this.releaseRes(prefab);
        }
        else
        {
            let asset = cc.resources.get(urlOrAssetOrNode);
            if(asset){
                this.releaseRes(asset);
            }
            
        }
    }

    public dump():void{
        let str:string = "******** RES dump ********";
        LogUtils.log(this,str);
        let count:number = 0;
        cc.assetManager.assets.forEach((asset,key)=>{
            if(asset.refCount>0){
                LogUtils.log(this,'key:'+key+',count:'+asset.refCount+'');
                count+= asset.refCount;
            }
        })
        LogUtils.log(this,'******** total:'+count+'');
    }
    
}

export var RES = ResourceManager.getInstance();