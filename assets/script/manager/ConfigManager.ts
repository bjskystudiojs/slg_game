import { RES } from "./ResourceManager";
import LogUtils from "../utils/LogUtils";

export default class ConfgManager {

    private static _instance: ConfgManager;
    public static getInstance(): ConfgManager {
        if (!this._instance) {
            this._instance = new ConfgManager();
        }
        return this._instance;
    }
    private configJosnPath: string = "Config/";
    private _dataInit: boolean = false;
    public data: any = {};

    public loadCfgMap: Map<any, any> = null;

    public init(success: Function, failed?: Function) {
        if (this._dataInit) {
            success();
        } else {
            RES.loadAsset(this.configJosnPath + "list", cc.JsonAsset, (jsonObj) => {
                let list = jsonObj.json;
                LogUtils.log(this, "json listtotal:" + list.length);
                Config.loadConfigList(list, success);
            });
        }
    }

    //加载配置列表
    private loadConfigList(list: any, complete: Function) {
        Config.loadCfgMap = new Map();
        list.forEach(function(value){
            Config.loadCfgMap.set(value, 1);
        });

        let onLoaded = function (key) {
            Config.loadCfgMap.delete(key);
            if (Config.loadCfgMap.size == 0) {
                Config._dataInit = true;
                complete();
            }
        }
        let cfgNum = list.length;
        for (let i = cfgNum - 1; i >= 0; i--) {
            let cfgKey = list[i];
            Config.loadConfig(cfgKey, onLoaded);
        }
    }
    //加载配置文件
    private loadConfig(cfgKey, callback) {
        RES.loadAsset(this.configJosnPath + cfgKey, cc.JsonAsset, function (jsonObj,err) {
            if(!err){
                Config.data[cfgKey] = jsonObj.json;
            }
            callback && callback(cfgKey);
        });
    }

    public initServer() {

    }

    /**
     * 获取配置表
     * @param tableName 表名
     */
    public getConfigData(tableName:string){
        if(this.data[tableName]){
            return this.data[tableName];
        }else{
            return null;
        }
    }
}

export var Config = ConfgManager.getInstance();