import { Module } from "../../manager/ModuleManager";
import { ResConst } from "../../const/ResConst";
import { BaseComp } from "../../core/BaseComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildingNode extends BaseComp {
    @property(cc.Node)
    sprNode: cc.Node = null;
    @property(cc.Node)
    animNode: cc.Node = null;

    //建筑id
    public buildingId: number = 0;
    public buildingTypeId: number = 400000;

    public init(bid: number, tid: number) {
        this.buildingId = bid;
        this.buildingTypeId = tid;
        let cfg = Module.building.getBuildingConfig(tid);
        let spr = this.sprNode.getComponent(cc.Sprite);
        this.loadSpriteAtlas(cfg.pic,ResConst.BuildingAtlas,spr);
    }
}