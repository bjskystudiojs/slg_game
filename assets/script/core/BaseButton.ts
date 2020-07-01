import TouchDelegate, { TouchTypeEnum } from "./TouchDelegate";

const { ccclass, property } = cc._decorator;

/**
 * 基础按钮 by liuxin
 */
@ccclass
export default class BaseButton extends cc.Button {

    // LIFE-CYCLE CALLBACKS:
    private _touchDelegate: TouchDelegate = new TouchDelegate();

    onLoad() {
        // this._touchDelegate = new TouchDelegate();
    }

    onEnable() {
        super.onEnable();
        this.addListener();
    }

    onDisable() {
        super.onDisable();
        this.removeListener();
    }

    private addListener() {
        this._touchDelegate.listen(this.node);

    }
    private removeListener() {
        this._touchDelegate && this._touchDelegate.unlisten();
    }

    public dispose() {
        this.removeListener();
        this.removeAllHandler();
    }

    /**
     * 添加一个touch事件监听
     * @param type  touch事件
     * @param handler 监听
     */
    public addTouchHandler(type: TouchTypeEnum, handler: Function) {
        this._touchDelegate && this._touchDelegate.addTouchHandler(type, handler);
    }

    /**
     * 移除一个touch事件监听
     * @param typeOrHandler 事件类型，或者回调（注意bind的回调会生成新的function 不能有效移除）
     */
    public removeTouchHandler(typeOrHandler: any) {
        this._touchDelegate && this._touchDelegate.removeTouchHandler(typeOrHandler);
    }

    /**
     * 移除所有事件监听
     */
    public removeAllHandler() {
        this._touchDelegate && this._touchDelegate.removeAllHandler();
    }
    /**
     * 设置按钮的默认文本
     * @param str 文本
     */
    public setString(str: string) {
        let labelNode: cc.Node = this.node.getChildByName("Label");
        if (labelNode) {
            let label: cc.Label = labelNode.getComponent(cc.Label);
            if (label)
                label.string = str;
        } else {
            let label: cc.Label = this.node.getComponentInChildren(cc.Label);
            if (label) {
                label.string = str;
            }
        }
    }
}
