import BaseScene from "./BaseScene";
import TouchDelegate, { TouchTypeEnum } from "./TouchDelegate";
import { RES } from "../manager/ResourceManager";
import LogUtils from "../utils/LogUtils";
import { Dialog } from "../manager/DialogManager";

const { ccclass, property } = cc._decorator;

/**
 * 可以拖拽的场景
 */
export default class DragableScene extends BaseScene{

    @property(cc.Node)
    mapLayer: cc.Node = null;

    private touchDelegate:TouchDelegate = null;
    protected _mapStartPos:cc.Vec2 = cc.v2(0,0);
    protected _mapScale:number = 1;

    protected MAX_MAP_SCALE:number = 1.5;
    protected MIN_MAP_SCALE:number = 0.3;

    public init(){
        super.init();
        this.touchDelegate = new TouchDelegate();
        this.touchDelegate.listen(this.node);
        this.touchDelegate.addTouchHandler(TouchTypeEnum.TouchClick,this.onTouchClick.bind(this));
        this.touchDelegate.addTouchHandler(TouchTypeEnum.TouchMove,this.onTouchMove.bind(this));
        this.touchDelegate.addTouchHandler(TouchTypeEnum.TouchZoom,this.onTouchZoom.bind(this));
        this.touchDelegate.addTouchHandler(TouchTypeEnum.SingleTouchBegin,this.onSingleTouchBegin.bind(this));
        this.touchDelegate.addTouchHandler(TouchTypeEnum.MutiTouchBegin,this.onMutiTouchBegin.bind(this));
        
    }

    protected onTouchClick(pos){
        Dialog.dumpPool();
        RES.dump();
    }

    protected onTouchMove(offset){
        let curPos = this._mapStartPos.add(offset);
        this.mapLayer.setPosition(curPos);
    }

    protected onTouchZoom(rate,offset){
        let zoomRate = this._mapScale * rate;
        if (zoomRate > this.MAX_MAP_SCALE) {
			zoomRate = this.MAX_MAP_SCALE;
		} else if (zoomRate < this.MIN_MAP_SCALE) {
			zoomRate = this.MIN_MAP_SCALE;
        }
        LogUtils.log(this,"scene zoom:"+zoomRate+",max:"+this.MAX_MAP_SCALE+",min:"+this.MIN_MAP_SCALE)

		this.mapLayer.setScale(zoomRate);
    }

    protected onSingleTouchBegin(){
        this._mapStartPos = this.mapLayer.getPosition();
        this._mapScale = this.mapLayer.scale;

    }

    protected onMutiTouchBegin(){
        this._mapStartPos = this.mapLayer.getPosition();
        this._mapScale = this.mapLayer.scale;
    }
    
    onDispose(){
        super.onDispose();
        this.touchDelegate.unlisten();
        this.touchDelegate.removeAllHandler();
    }
}