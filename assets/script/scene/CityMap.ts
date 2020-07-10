import BuildingNode from "../view/building/BuildingNode";
import { Module } from "../manager/ModuleManager";
import { BaseComp } from "../core/BaseComp";
import { ResConst } from "../const/ResConst";
import LogUtils from "../utils/LogUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityMap extends BaseComp{

    private buildings:Map<number,BuildingNode>;
    private buildCount:number = 0;

    private zFieldItems:number = 1;
    private zBuilding:number = 2;
    private zBuildingUI:number = 3;

    //地形装饰
    private layerFieldItems:cc.Node;
    //建筑\人物\路
    private layerBuilding:cc.Node;
    //建筑ui
    private layerBuildingUI:cc.Node;


    public initMap(){

        this.layerFieldItems = new cc.Node();
        this.node.addChild(this.layerFieldItems,this.zFieldItems);
        this.layerBuilding = new cc.Node();
        this.node.addChild(this.layerBuilding,this.zBuilding);
        this.layerBuildingUI = new cc.Node();
        this.node.addChild(this.layerBuildingUI,this.zBuildingUI);

        this.initBuilding();
    }

    private initBuilding(){
        this.buildings = new Map();
        let buildingData = Module.building.testBuildingData;

        this.buildCount = Object.keys(buildingData).length;
        for(var id in buildingData){
            let bid = Number(id);
            this.loadPrefab(ResConst.BuildingNode,(node:cc.Node)=>{
                this.layerBuilding.addChild(node);
                let data = buildingData[bid];
                node.setPosition(this.logicPosToMapPos(data.pos))
                let building:BuildingNode = node.getComponent(BuildingNode);
                building.init(bid,data.id);
                this.buildings.set(bid,building);
                if(this.buildCount == this.buildings.size){
                    LogUtils.log(this,"building load finish,count:"+this.buildCount);
                }
            });
        }
    }

    public logicPosToMapPos(logicPos:cc.Vec2):cc.Vec2{
        return logicPos.multiplyScalar(200);
    }
    public mapPosToLogicPos(mapPos:cc.Vec2):cc.Vec2{
        let logicPos = mapPos.multiplyScalar(1/200);
        let x = ~~(logicPos.x);
        let y = ~~(logicPos.y);
        return cc.v2(x,y)
    }

    onDispose(){
        super.onDispose();
        // this.buildings.forEach((comp:BuildingNode,id:number)=>{
        //     comp.dispose();
        //     comp.node.destroy();
        // })
        // this.buildings = null;
    }
}
