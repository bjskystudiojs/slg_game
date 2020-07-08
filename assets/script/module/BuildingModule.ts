import { Config } from "../manager/ConfigManager";

/**
 * 建筑模块
 */
export default class BuildingModule{
    public testBuildingData:any;

    //服务器数据
    public initBuildingData(){
        this.testBuildingData = {};
        let buidlingIds = [400000,401000,402000,403000,404000,407000,410000,411000,412000,413000];
        for(var i=0;i<16;i++){
            for(var j=0;j<16;j++){
                let buildingId = buidlingIds[Math.min(~~(buidlingIds.length*Math.random()),buidlingIds.length-1)];
                this.testBuildingData[i*16+j] = {
                    id:buildingId,
                    size:cc.v2(2,2),
                    pos:cc.v2(i*2,j*2),
                }
            }
        }
    }

    private _buildingCfg:Map<number,any> = null;
    public get buildingCfg():Map<number,any>{
        if(!this._buildingCfg){
            this._buildingCfg = new Map();
            let cfgs = Config.getConfigData("building.datas");
            for(var key in cfgs){
                let data = cfgs[key];
                if(data.id){
                    this._buildingCfg.set(data.id,data);
                }
            }
        }
        return this._buildingCfg;
    }

    public getBuildingConfig(buildingId?:number):any{
        let cfg = this.buildingCfg;
        if(isNaN(buildingId)){
            return cfg;
        }else{
            return cfg.get(buildingId);
        }
    }
}