import { isString } from "../utils/CommonUtil";
import LogUtils from "../utils/LogUtils";

/**
 * 交互事件代理 by liuxin
 */
export default class TouchDelegate {
    //点击的最长时间，超过为长按(毫秒)
    public static MAX_CLICK_TIME:number = 600;
    public static MIN_MOVE_SQRDISTANCE:number = 1200;

    public listen(target:cc.Node) {
        if (this._target)
            return;
        this._target = target;
        this._target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    public unlisten() {
        if (!this._target)
            return;
        this._target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this._target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this._target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this._target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this._target = null;
    }

    private _touchesMap:any = {};
    private _target: cc.Node = null;
    private _isTouching:boolean = false;
    //是否点击
    private _clickFlag:boolean = false;
    //触摸开始时间 
    private _touchStartTime:number = 0;
    //开始点
    private _startCenterPos:cc.Vec2 = null;
    //中心点
    private _currCenterPos:cc.Vec2 = null;
    //两指开始的距离
    private _initDistance:number = 0;
    //两指最后的距离
    private _lastDistance:number = 0;

    /**
     * 当前中心坐标
     */
    public getLocation(){
        return this._currCenterPos;
    }
    
    private onTouchStart(evt){
        let touches = evt.getTouches();
        var boxRect = this._target.getBoundingBoxToWorld();
        for (var i = 0; i < touches.length; i++) {
            var touchID = touches[i].getID();
            if (this._touchesMap[touchID] != null || !boxRect.contains(touches[i].getLocation())) {
                continue;
            }
            //做多支持两个点的触摸，不支持更多了
            if(Object.keys(this._touchesMap).length>=2){
                break;
            }
            this._touchesMap[touchID] = touches[i].getLocation();
            // LogUtils.log(this,"touch start,add touch,touchid:"+touchID);
        }
        this._isTouching = true;

        let touchesNumber = Object.keys(this._touchesMap).length;
        if (touchesNumber == 0) {
            this._isTouching = false;
        } else if (touchesNumber == 1) {
            this._clickFlag = true;
            this.singleTouchReset();
        } else if (touchesNumber == 2) {
            this.multiTouchReset();
        }
    }
    private onTouchMove(evt){
        if (!this._isTouching) {
            return false;
        }
        let touches = evt.getTouches();
        this.refreshTouchesList(touches);

        let touchesNumber = Object.keys(this._touchesMap).length;
        if (touchesNumber == 1 && this._startCenterPos) {
            //单指移动
            var offset:cc.Vec2 = touches[0].getLocation().sub(this._startCenterPos);
            this._currCenterPos = touches[0].getLocation();
            
            // LogUtils.log(this,"moved,offset:"+offset.toString());
            this.onTouchMoveHandler(offset);
            if (this._clickFlag) {
                if (offset.magSqr() > TouchDelegate.MIN_MOVE_SQRDISTANCE) {
                    this._clickFlag = false;
                }
            }
        } else if (touchesNumber >= 2 && this._startCenterPos) {
            var touchIDArr = Object.keys(this._touchesMap);
            var posA = this._touchesMap[touchIDArr[0]];
            var posB = this._touchesMap[touchIDArr[1]];
            this._lastDistance = posB.sub(posA).mag();
            var zoomRate = this._lastDistance / this._initDistance;
            var centerPos:cc.Vec2 = posA.add(posB).mul(0.5);
            var offset = centerPos.sub(this._startCenterPos);
            this._currCenterPos = centerPos;

            // LogUtils.log(this,"zoomed,offset:"+offset.toString()+",rate:"+zoomRate);
            this.onTouchZoomHandler(zoomRate,offset);
        }
    }
    private onTouchEnd(evt){
        if (!this._isTouching) {
            return false;
        }
        let touches = evt.getTouches();
        for (var i = 0; i < touches.length; i++) {
            var touchID = touches[i].getID();
            if (this._touchesMap[touchID] != null) {
                delete this._touchesMap[touchID];
                // LogUtils.log(this,"touch end,remove touch,touchid:"+touchID);
            }
        }
        let touchesNumber = Object.keys(this._touchesMap).length;
        if (touchesNumber == 0) {
            this._isTouching = false;
            if (this._clickFlag) { //判断点击
                let touch = touches[0].getLocation();
                var boxRect = this._target.getBoundingBoxToWorld();
                if(boxRect.contains(touch)){
                    var deltaTime = Date.now() - this._touchStartTime;
                    if (deltaTime < TouchDelegate.MAX_CLICK_TIME){//600毫秒之内抬起算是点击
                        let pos:cc.Vec2 = touches[0].getLocation();

                        // LogUtils.log(this,"clicked,pos:"+pos.toString());
                        this.onTouchClickHandler(pos);
                    }
                }
                this._clickFlag = false;
            }
        } else if (touchesNumber == 1) {
            this.singleTouchReset();
        } else if (touchesNumber == 2) {
            this.multiTouchReset();
        }
    }
    private onTouchCancel(evt){
        // LogUtils.log(this,"touch canceled");
        this.onTouchEnd(evt);
    }
    private refreshTouchesList(touches) {
        for (var i = 0; i < touches.length; i++) {
            var touchesID = touches[i].getID();
            if (this._touchesMap[touchesID] != null) {
                this._touchesMap[touchesID] = touches[i].getLocation();
            } else {
                cc.log("WARNING:UNREG TOUCH");
            }
        }
    }
    private singleTouchReset(){
        this._touchStartTime = Date.now();
        var touchIDArr = Object.keys(this._touchesMap);
        this._startCenterPos = this._touchesMap[touchIDArr[0]];
        this._currCenterPos = this._startCenterPos;
        this.onTouchSingleBeginHandler();
    }

    private multiTouchReset(){
        this._clickFlag = false;
        var touchIDArr = Object.keys(this._touchesMap);
        var posA:cc.Vec2 = this._touchesMap[touchIDArr[0]];
        var posB:cc.Vec2 = this._touchesMap[touchIDArr[1]];
        this._initDistance = posB.sub(posA).mag();
        this._startCenterPos = posA.add(posB).mul(0.5);
        this._currCenterPos = this._startCenterPos;
        this.onTouchMutiBeginHandler();
    }

    private _touchHandlerMap:any = {};

    /**
     * 添加一个touch事件监听
     * @param type  touch事件
     * @param handler 监听
     */
    public addTouchHandler(type:TouchTypeEnum,handler:Function){
        if(!this._touchHandlerMap){
            this._touchHandlerMap = {};
        }
        this._touchHandlerMap[type] = handler;
    }

    /**
     * 移除一个touch事件监听
     * @param typeOrHandler 事件类型，或者回调（注意bind的回调会生成新的function 不能有效移除）
     */
    public removeTouchHandler(typeOrHandler:any){
        if(isString(typeOrHandler)){
            delete this._touchHandlerMap[typeOrHandler];
        }else if(typeOrHandler instanceof Function){
            for(var key in this._touchHandlerMap){
                if(this._touchHandlerMap[key] == typeOrHandler){
                    delete this._touchHandlerMap[key];
                    break;
                }
            }
        }
    }

    /**
     * 移除所有事件监听
     */
    public removeAllHandler(){
        this._touchHandlerMap = {};
    }


    private onTouchClickHandler(pos:cc.Vec2) {
        var handler = this._touchHandlerMap[TouchTypeEnum.TouchClick];
        if(handler){
            handler(pos);
        }
    }

    private onTouchMoveHandler(offset:cc.Vec2){
        var handler = this._touchHandlerMap[TouchTypeEnum.TouchMove];
        if(handler){
            handler(offset);
        }
    }
    private onTouchZoomHandler(rate:number,offset:cc.Vec2){
        var handler = this._touchHandlerMap[TouchTypeEnum.TouchZoom];
        if(handler){
            handler(rate,offset);
        }
    }
    private onTouchSingleBeginHandler(){
        var handler = this._touchHandlerMap[TouchTypeEnum.SingleTouchBegin];
        if(handler){
            handler();
        }
    }
    private onTouchMutiBeginHandler(){
        var handler = this._touchHandlerMap[TouchTypeEnum.MutiTouchBegin];
        if(handler){
            handler();
        }
    }
}

export enum TouchTypeEnum{
    TouchClick = "click", //点击
    TouchLongPressBegin = "longPressBegin",    //长按开始
    TouchLongPressEnd = "longPressEnd",  //长按结束
    TouchMove = "touchMove",  //单指移动
    TouchZoom = "touchZoom",  //双指缩放
    SingleTouchBegin = "singleTouchBegin", //单指按下时
    MutiTouchBegin = "mutiTouchBegin"   //双指按下时
}