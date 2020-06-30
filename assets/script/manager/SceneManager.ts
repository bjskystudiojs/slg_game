import BaseScene from "../core/BaseScene";


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
    public currentScene:BaseScene;

    private _layers = {};
    public getLayer(layer:LayerEnum):cc.Node{
        return this._layers[layer];
    }

    public initLayers(root:cc.Node){
        this._rootNode = root;
        cc.game.addPersistRootNode(this._rootNode);

        //初始化层
        let uiLayer:cc.Node = new cc.Node();
        this._rootNode.addChild(uiLayer);
        this._layers[LayerEnum.UILayer] = uiLayer;
        let dialogLayer:cc.Node = new cc.Node();
        this._rootNode.addChild(dialogLayer);
        this._layers[LayerEnum.DialogLayer] = dialogLayer;
        let tipLayer:cc.Node = new cc.Node();
        this._rootNode.addChild(tipLayer);
        this._layers[LayerEnum.TipLayer] = tipLayer;
        let guideLayer:cc.Node = new cc.Node();
        this._rootNode.addChild(guideLayer);
        this._layers[LayerEnum.GuideLayer] = guideLayer;
    }

    /**
     * 切换场景
     * @param scene 场景名
     */
    public changeTo(scene:SceneEnum){
        
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
    MainScene = "MainScene" ,
    WorldScene = "WorldScene" ,
}

export var Scene = SceneManager.getInstance();