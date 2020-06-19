export default class ConfgManager{

    private static _instance:ConfgManager;
    public static getInstance():ConfgManager{
        if(!this._instance){
            this._instance = new ConfgManager();
        }
        return this._instance;
    }

    public init() {
        
    }
}

export var Config = ConfgManager.getInstance();