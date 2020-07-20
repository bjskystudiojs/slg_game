import BaseDialog from "../core/BaseDialog";
import { LayerEnum, Scene } from "./SceneManager";
import LogUtils from "../utils/LogUtils";
import { ResConst } from "../const/ResConst";
import { RES } from "./ResourceManager";
import AutoPool from "../core/pool/AutoPool";
import { BaseComp } from "../core/BaseComp";


/**
 * 弹窗管理 by liuxin
 */
export default class DialogManager{

    private static _instance:DialogManager;
    public static getInstance():DialogManager{
        if(!this._instance){
            this._instance = new DialogManager();
        }
        return this._instance;
    }

    private _maskLayer:cc.Node = null;
    private _dialogStack:Array<BaseDialog> = [];
    private _currentDialog:BaseDialog = null;
    private _dialogPool:AutoPool = new AutoPool(4);

    public showDialog(path:string,...args:any[]){
        //从对象池中取个实例出来显示
        this._dialogPool.requestNode(path,(node:cc.Node)=>{
            let b = node.getComponent(BaseComp);
            if(!b)
            {
                b = node.addComponent(BaseComp);
            }
            b.path = path;
            b.poolRef = this._dialogPool;
            b.init(...args)
            if(b instanceof BaseDialog){
                b.onShow();
                this.__showDialog(b);
            }else{
                LogUtils.warn(this,"__showDialog failed:is not a dialog ",b.name);
            }
        });
    }

    private __showDialog(dialog:BaseDialog){

        if(this._dialogStack.length==0){
            this.addMaskLayer();
            this.setMaskLayerIndex(1);
            dialog._zIndex = 2;
        }else{
            this.setMaskLayerIndex(this._currentDialog._zIndex+1);
            dialog._zIndex= this._currentDialog._zIndex+2;
        }
        this._currentDialog = dialog;
        this._dialogStack.push(dialog);

        let dialogRoot = Scene.getLayer(LayerEnum.DialogLayer);
        dialogRoot.addChild(dialog.node,dialog._zIndex);
    }

    public closeDialog(node:cc.Node){
        let dialog:BaseDialog = node.getComponent(BaseDialog);
        if(dialog){
            //回收
            dialog.onHide(()=>{
                this.__closeDialog(dialog);
            });
        }else{
            LogUtils.warn(this,"__closeDialog failed:is not a dialog ",dialog.name);
        }
    }

    private __closeDialog(dialog:BaseDialog){

        let dialogIdx = this._dialogStack.indexOf(dialog);
        if(dialogIdx>-1){
            if(dialogIdx == this._dialogStack.length-1){ //最后一个
                this._dialogStack.pop();
                if(this._dialogStack.length == 0){ //没有了
                    this.removeMaskLayer();
                }else{
                    this._currentDialog = this._dialogStack[this._dialogStack.length-1];
                    this.setMaskLayerIndex(this._currentDialog._zIndex-1);
                }
            }else{
                //只是移除
                this._dialogStack.splice(dialogIdx,1);
            }
            dialog.dispose();
        }else{
            LogUtils.warn(this,"__closeDialog failed:not open ",dialog.name);
            dialog._zIndex = 0;
        }
    }

    /**
     * 移除所有弹窗
     */
    public removeAll(){
        while(this._dialogStack.length>0){
            let dialog:BaseDialog = this._dialogStack.pop();
            dialog.dispose();
        }
        this._dialogStack = [];
        this._currentDialog = null;
        this.removeMaskLayer();
    }

    private addMaskLayer(){
        this._maskLayer = new cc.Node();
        this._maskLayer.name = "mask";
        this._maskLayer.color = new cc.Color().fromHEX('#000000');
        this._maskLayer.opacity = 100;
        this._maskLayer.setContentSize(cc.winSize);
        var maskSpr:cc.Sprite = this._maskLayer.addComponent(cc.Sprite);
        maskSpr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        RES.loadAsset(ResConst.Default_Splash_Sprite,cc.SpriteFrame,(res)=>{
            maskSpr.spriteFrame = res as any;
        });
        this._maskLayer.addComponent(cc.BlockInputEvents);
        let dialogRoot = Scene.getLayer(LayerEnum.DialogLayer);
        dialogRoot.addChild(this._maskLayer);
    }
    
    private setMaskLayerIndex(ind:number){
        this._maskLayer.setSiblingIndex(ind);
    }

    private removeMaskLayer(){
        if(this._maskLayer){
            this._maskLayer.destroy();
            this._maskLayer = null;
        }
    }

    public dumpPool(){
        this._dialogPool.dump();
    }

    public clearPool(){
        this._dialogPool.clear();
    }
}

export var Dialog = DialogManager.getInstance();