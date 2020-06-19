import TouchDelegate from "./TouchDelegate";

const { ccclass, property } = cc._decorator;

/**
 * 基础按钮 by liuxin
 */
@ccclass
export default class BaseButton extends cc.Button {

    // LIFE-CYCLE CALLBACKS:
    private _touchDelegate: TouchDelegate;
    //一系列事件
    private _touchClickHandler: Function = null;

    onLoad() {
        this._touchDelegate = new TouchDelegate();
     }

    onEnable() {
        super.onEnable();
        this.addListener();
   }

    onDisable() {
        super.onDisable();
        this.removeListener();
    }

    public addListener(){
        this._touchDelegate.listen(this.node);
        this.node.on(TouchDelegate.Notice_Touch_Click, this.onNoticeTouchClick, this);

    }
    public removeListener(){
        this._touchDelegate && this._touchDelegate.unlisten();
        this.node.off(TouchDelegate.Notice_Touch_Click, this.onNoticeTouchClick, this);
    }

    public dispose() {
        this.removeListener();
        this._touchClickHandler = null;
    }

    private onNoticeTouchClick(evt) {
        this._touchClickHandler && this._touchClickHandler(evt);
    }
    /**
     * 设置点击的回调
     * @param func 点击的回调
     */
    public setTouchClickHandler(func: Function): void {
        this._touchClickHandler = func;
    }

    /**
     * 设置按钮的默认文本
     * @param str 文本
     */
    public setString(str:string){
        let labelNode:cc.Node = this.node.getChildByName("Label");
        if(labelNode){
            let label:cc.Label = labelNode.getComponent(cc.Label);
            if(label)
                label.string = str;
        }else{
            let label:cc.Label = this.node.getComponentInChildren(cc.Label);
            if(label){
                label.string = str;
            }
        }
    }
}
