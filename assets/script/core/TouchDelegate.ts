/**
 * 交互事件代理 by liuxin
 */
export default class TouchDelegate {

    //点击
    public static Notice_Touch_Click = "Notice_Touch_Click";
    //双击，应该不用
    public static Notice_Touch_DoubleClick = "Notice_Touch_DoubleClick";
    //长按下
    public static Notice_Touch_LongTimePress = "Notice_Touch_LongTimePress";

    public listen(target: cc.Node) {
        if(this._targetNode)
            return;
        this._targetNode = target;
        this._targetNode.on(cc.Node.EventType.TOUCH_START, this.onTouchCallback, this);
        this._targetNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchCallback, this);
        this._targetNode.on(cc.Node.EventType.TOUCH_END, this.onTouchCallback, this);
        this._targetNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCallback, this);
    }

    public unlisten() {
        if(!this._targetNode)
            return;
        this._targetNode.off(cc.Node.EventType.TOUCH_START, this.onTouchCallback, this);
        this._targetNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchCallback, this);
        this._targetNode.off(cc.Node.EventType.TOUCH_END, this.onTouchCallback, this);
        this._targetNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCallback, this);
        this._targetNode = null;
    }

    private _targetNode: cc.Node = null;

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
        //射出去
        this._targetNode.emit(TouchDelegate.Notice_Touch_Click, evt);
    }
}