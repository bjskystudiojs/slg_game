/**
 * 平台登录支付相关.by liuxin
 */
export default class PlatformManager{

    private static _instance:PlatformManager;
    public static getInstance():PlatformManager{
        if(!this._instance){
            this._instance = new PlatformManager();
        }
        return this._instance;
    }

    //登录
    public login(success:Function,failed:Function){

        //测试
        setTimeout(success,100);

    }


    private initServerConfig(){

    }
}

export var Platform = PlatformManager.getInstance();