import { BaseComp } from "../../manager/NodeManager";
import { Module } from "../../manager/ModuleManager";
import { ResConst } from "../../const/ResConst";

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
        let pic = ResConst.BuildingPic + cfg.pic;
        this.loadSprite(pic,null,(spr:cc.SpriteFrame)=>{
            if(spr){
                this.sprNode.getComponent(cc.Sprite).spriteFrame = spr;
            }
        });
    }
}