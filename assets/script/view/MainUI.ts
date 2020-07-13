import BaseButton from "../core/BaseButton";
import { BaseComp } from "../core/BaseComp";
import LinkPrefab from "../core/LinkPrefab";
import MainCityUI from "./MainCityUI";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends BaseComp {

    @property(BaseButton)
    btnTask: BaseButton = null;
    @property(BaseButton)
    btnBag: BaseButton = null;
    @property(BaseButton)
    btnHero: BaseButton = null;
    @property(BaseButton)
    btnAlliance: BaseButton = null;
    @property(BaseButton)
    btnMail: BaseButton = null;
    @property(BaseButton)
    btnOther: BaseButton = null;
    @property(BaseButton)
    btnWorld: BaseButton = null;
    @property([cc.Node])
    resUIArr: Array<cc.Node> = [];
    @property(LinkPrefab)
    mainCityUILink:LinkPrefab = null;

    private _maincityUI:MainCityUI;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this._maincityUI = this.mainCityUILink.getPrefabComponect(MainCityUI);
    }

    start () {

    }

    onDispose(){
        super.onDispose();
    }

    // update (dt) {}
}
