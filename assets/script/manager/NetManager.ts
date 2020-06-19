export default class NetManager{

    private static _instance:NetManager;
    public static getInstance():NetManager{
        if(!this._instance){
            this._instance = new NetManager();
        }
        return this._instance;
    }

    public init(){
        this.initServerConfig();
    }


    private initServerConfig(){

    }
}

export var Net = NetManager.getInstance();