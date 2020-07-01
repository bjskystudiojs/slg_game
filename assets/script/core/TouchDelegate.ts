/**
 * 交互事件代理 by liuxin
 */
export default class TouchDelegate {

    public listen(target:cc.Node, eventTarget: any) {
        if (this._target)
            return;
        this._target = target;
        this._eventTarget = eventTarget;
        this._target.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback, this);
        this._target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchCallback, this);
        this._target.on(cc.Node.EventType.TOUCH_END, this.onTouchCallback, this);
        this._target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCallback, this);
    }

    public unlisten() {
        if (!this._target)
            return;
        this._target.off(cc.Node.EventType.TOUCH_START, this.onTouchCallback, this);
        this._target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchCallback, this);
        this._target.off(cc.Node.EventType.TOUCH_END, this.onTouchCallback, this);
        this._target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCallback, this);
        this._target = null;
        this._eventTarget = null;
    }

    private _target: cc.Node = null;
    private _eventTarget: any = null;

    private onTouchCallback(evt) {
        switch (evt.type) {
            case cc.Node.EventType.TOUCH_START: {
            } break;
            case cc.Node.EventType.TOUCH_END: {
                this.onTouchClickHandler(evt);
            } break;
            case cc.Node.EventType.TOUCH_MOVE: {

            } break;
            case cc.Node.EventType.TOUCH_CANCEL: {

            } break;
        }
    }
    private onTouchClickHandler(evt) {
        if(this._eventTarget && this._eventTarget.onTouchClick){
            this._eventTarget.onTouchClick(evt);
        }
    }
}