import BaseComp from "../core/BaseComp";
import BuildingNode from "../view/building/BuildingNode";
import { Module } from "../manager/ModuleManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityMap extends BaseComp{

    private _buildings:Map<number,BuildingNode>;

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
        this._buildings = new Map();
        let buildingData = Module.building.testBuildingData;
        for(var key in buildingData){
        }
    }

    public dispose(){
        this._buildings.forEach((node:BuildingNode,id:number)=>{
            node.dispose();
        })
    }
}
