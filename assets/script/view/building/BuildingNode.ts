import BaseComp from "../../core/BaseComp";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildingNode extends BaseComp {
    @property(cc.Node)
    sprNode: cc.Node = null;
    @property(cc.Node)
    animNode: cc.Node = null;


    //建筑id
    public buildingId:number = 400000;
}