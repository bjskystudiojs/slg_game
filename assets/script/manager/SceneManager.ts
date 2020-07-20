import BaseScene from "../core/BaseScene";
import SceneTransfer from "../scene/SceneTransfer";
import { RES } from "./ResourceManager";


/**
 * 场景管理 by liuxin
 */
export default class SceneManager{

    private static _instance:SceneManager;
    public static getInstance():SceneManager{
        if(!this._instance){
            this._instance = new SceneManager();
        }
        return this._instance;
    }

    private _rootNode:cc.Node;
    public get rootNode():cc.Node{
        return this._rootNode;
    }
    /**
     * BaseScene组件
     */
    public currentScene:BaseScene;
    /**
     * 原生场景对象
     */
    public currentSceneNative(){
        let cur_scene:cc.Scene = cc.director.getScene();
        return cur_scene;
    }

    private _layers = {};
    public getLayer(layer:LayerEnum):cc.Node{
        return this._layers[layer];
    }

    public setFirstScene(scene:BaseScene){
        //第一个场景要手动设置
        var sceneNt = this.currentSceneNative();
        RES.countSceneAsset(sceneNt);
        this.currentScene = scene;
    }

    public initLayers(root:cc.Node){
        this._rootNode = root;
        cc.game.addPersistRootNode(this._rootNode);

        //初始化层
        let uiLayer:cc.Node = new cc.Node();
        this.addWidget(uiLayer);
        this._rootNode.addChild(uiLayer);
        this._layers[LayerEnum.UILayer] = uiLayer;
        let dialogLayer:cc.Node = new cc.Node();
        this.addWidget(dialogLayer);
        this._rootNode.addChild(dialogLayer);
        this._layers[LayerEnum.DialogLayer] = dialogLayer;
        let tipLayer:cc.Node = new cc.Node();
        this.addWidget(tipLayer);
        this._rootNode.addChild(tipLayer);
        this._layers[LayerEnum.TipLayer] = tipLayer;
        let guideLayer:cc.Node = new cc.Node();
        this.addWidget(guideLayer);
        this._rootNode.addChild(guideLayer);
        this._layers[LayerEnum.GuideLayer] = guideLayer;
    }
    private addWidget(node:cc.Node){
        node.setContentSize(cc.winSize);
        let widget:cc.Widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.left = widget.right = widget.top = widget.bottom = 0;  
    }

    /**
     * 切换场景
     * @param scene 场景名
     */
    public changeTo(sceneName:SceneEnum){
        let oldScene = this.currentScene;
        let transfer:SceneTransfer = new SceneTransfer(oldScene.name,sceneName);
        transfer.exitTransfer(()=>{
            //卸载旧场景
            oldScene.dispose();
            // let oldSceneNt = this.currentSceneNative();
            // let oldAsset = oldSceneNt['dependAssets'];
            RES.loadScene(sceneName,() =>{
                //释放旧场景资源
                // RES.releaseSceneAsset(oldAsset);
                //设置新场景
                let newSceneNt = this.currentSceneNative();
                let scene_root = newSceneNt.children[0];
                let newScene:BaseScene = scene_root.getComponent(BaseScene);
                newScene.name = sceneName;
                if(newScene){
                    this.currentScene = newScene;
                    newScene.init();
                }
                transfer.enterTransfer(()=>{
                    if(newScene){
                        newScene.show();
                    }
                });
            });
        });
    }
}

export enum LayerEnum{
    UILayer = "UILayer",
    DialogLayer = "DialogLayer",
    TipLayer = "TipLayer",
    GuideLayer = "GuideLayer",
    
}

export enum SceneEnum{
    LoadingScene = "LoadingScene" ,
    CityScene = "CityScene" ,
    WorldScene = "WorldScene" ,
}

export var Scene = SceneManager.getInstance();