import BaseDialog from "../core/BaseDialog";
import { Pool } from "./PoolManager";
import { LayerEnum, Scene } from "./SceneManager";
import LogUtils from "../utils/LogUtils";
import { ResConst } from "../const/ResConst";


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

    public showDialog(path:string,...args:any[]){
        //从对象池中取个实例出来显示
        Pool.spawn(path,(node)=>{
            let dialog:BaseDialog = node.getComponent(BaseDialog);
            if(dialog){
                this.__showDialog(dialog);
            }else{
                LogUtils.warn(this,"__showDialog failed:is not a dialog ",dialog.name);
            }
        },...args);
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
            this.__closeDialog(dialog);
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
            //回收
            Pool.unspawn(dialog.node);
        }else{
            LogUtils.warn(this,"__closeDialog failed:not open ",dialog.name);
            dialog._zIndex = 0;
        }
    }


    private addMaskLayer(){
        this._maskLayer = new cc.Node();
        this._maskLayer.name = "mask";
        this._maskLayer.color = new cc.Color().fromHEX('#000000');
        this._maskLayer.opacity = 100;
        this._maskLayer.setContentSize(640,1134);
        var maskSpr:cc.Sprite = this._maskLayer.addComponent(cc.Sprite);
        maskSpr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        cc.loader.loadRes(ResConst.Default_Splash_Sprite,cc.SpriteFrame,(error,res)=>{
            maskSpr.spriteFrame = res;
        });
        this._maskLayer.addComponent(cc.BlockInputEvents);
        let dialogRoot = Scene.getLayer(LayerEnum.DialogLayer);
        dialogRoot.addChild(this._maskLayer);
    }
    
    private setMaskLayerIndex(ind:number){
        this._maskLayer.setSiblingIndex(ind);
    }

    private removeMaskLayer(){
        this._maskLayer.destroy();
        this._maskLayer = null;
    }

}

export var Dialog = DialogManager.getInstance();