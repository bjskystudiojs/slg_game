import BuildingModule from "../module/BuildingModule";
import RoleModule from "../module/RoleModule";

/**
 * 功能模块相关.by liuxin
 */
export default class ModuleManager{

    private static _instance:ModuleManager;
    public static getInstance():ModuleManager{
        if(!this._instance){
            this._instance = new ModuleManager();
        }
        return this._instance;
    }

    //建筑模块
    public building:BuildingModule;
    //角色模块
    public role:RoleModule;

    public init(){
        this.role = new RoleModule();
        this.building = new BuildingModule();
    }
}

export var Module = ModuleManager.getInstance();