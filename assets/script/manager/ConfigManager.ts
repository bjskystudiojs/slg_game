export default class ConfgManager{

    private static _instance:ConfgManager;
    public static getInstance():ConfgManager{
        if(!this._instance){
            this._instance = new ConfgManager();
        }
        return this._instance;
    }
    private _data:any ={};
    private _dataInit:boolean = false;

    public init(success:Function,failed?:Function) {
        if(this._dataInit){
            success();
        }else{
            let listJson:any;
            success();
        }
    }

    public initServer(){

    }
}

export var Config = ConfgManager.getInstance();