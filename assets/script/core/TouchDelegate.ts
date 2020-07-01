import { isString } from "../utils/CommonUtil";

/**
 * 交互事件代理 by liuxin
 */
export default class TouchDelegate {
    private _longPressTime:number = 0.6;

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

    private _target: cc.Node = null;
    
    private onTouchStart(evt){
        
    }
    private onTouchMove(evt){

    }
    private onTouchEnd(evt){
        this.onTouchClickHandler(evt);
    }
    private onTouchCancel(evt){
        
    }

    private _touchHandlerMap:any = null;

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
        this._touchHandlerMap = null;
    }


    private onTouchClickHandler(evt) {
        var handler = this._touchHandlerMap[TouchTypeEnum.TouchClick];
        if(handler){
            handler(evt);
        }
    }
}

export enum TouchTypeEnum{
    TouchClick = "click", //点击
    TouchLongPressBegin = "longPressBegin",    //长按开始
    TouchLongPressEnd = "longPressEnd",  //长按结束
    TouchMove = "touchMove",  //单指移动
    TouchZoom = "touchZoom",  //双指缩放
}