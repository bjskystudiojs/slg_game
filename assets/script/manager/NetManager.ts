export default class NetManager{

    private static _instance:NetManager;
    public static getInstance():NetManager{
        if(!this._instance){
            this._instance = new NetManager();
        }
        return this._instance;
    }

    public connect(server:string,port:number){

    }


    public reconnect(){
        
    }
}

export var Net = NetManager.getInstance();