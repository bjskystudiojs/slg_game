
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


    public loadAsset(path:string,type:typeof cc.Asset,cb:Function):any{
        let res:any = cc.loader.getRes(path, type);
        if(res){
            cb && cb(res);
            return;
        }
        cc.loader.loadRes(path, type, (err:any, res:any):void=>{
            if(err)
            {
                cc.warn("[ResourceManager]loadAsset error", path);
                return;
            }
            cb && cb(res);
        });
    }
}

export var RES = ResourceManager.getInstance();