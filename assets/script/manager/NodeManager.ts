import BasePool from "../core/BasePool";
import BaseDialog from "../core/BaseDialog";
import LogUtils from "../utils/LogUtils";
import { RES } from "./ResourceManager";

/**
 * 节点管理，by liuxin
 * @desc 通过节点管理统一生成和释放机制
 */
export default class NodeManager{
    private static _instance:NodeManager;
    public static getInstance():NodeManager{
        if(!this._instance){
            this._instance = new NodeManager();
        }
        return this._instance;
    }

    /**
     * 从对象池取出预制界面实例
     * @param pool 对象池
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawnWithPool(pool:BasePool,path:string,cb:Function,...params:any[]){
        pool.requestNode(path,(node:cc.Node)=>{
            let b = node.getComponent(BaseComp);
            if(!b)
            {
                b = node.addComponent(BaseComp);
            }
            b.path = path;
            b.poolRef = pool;
            b.init(...params)
            if(b instanceof BaseDialog){
                b.onShow();
            }
            cb && cb(node);
        });
    }

    /**
     * 创建预制界面实例
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public spawn(path:string,cb:Function,...params:any[]){
        RES.loadAsset(path,cc.Prefab,(obj)=>{
            let node = cc.instantiate(obj);
            node.active = true;
            let b = node.addComponent(BaseComp);
            b.path = path;
            b.init(...params)
            if(b instanceof BaseDialog){
                b.onShow();
            }
            cb && cb(node);
        })
    }

    public unspawn(node:cc.Node){
        var b:BaseComp = node.getComponent(BaseComp);
        if(b){
            if(b.poolRef){ //从pool中创建的
                if(b instanceof BaseDialog){
                    b.onHide(()=>{
                        b.dispose();
                        b.poolRef.returnNode(b.path,node);
                        b.poolRef = null;
                    });
                }else{
                    b.dispose();
                    b.poolRef.returnNode(b.path,node);
                    b.poolRef = null;
                }
            }else{  //普通的comp
                b.dispose();
                node.destroy();
            }
        }else{
            LogUtils.warn(this,"node unspawn failed,is not a baseComponent.");
        }
    }
}

/**
 * 基础组件
 * @description 统一初始化和清理接口:init/dispose、资源卸载，支持加载其他资源的方法
 * @file 放在NodeManager里面是因为Ts循环引用的问题
 */
export class BaseComp extends cc.Component {
    protected delayTime: number = 0;
    protected delayTimeForMin: number = 0;
    protected tickEnable: boolean = false;

    //预设路径,
    public path:string ="";
    public poolRef:BasePool = null;
    // LIFE-CYCLE CALLBACKS:
    onLoad () {

    }

    start () {

    }

    /**
     * 初始化数据
     * @param params 参数
     */
    public init(...params:any[]) {
        
    }

    /**
     * 清理组件逻辑
     */
    public dispose(){
    }

    /**
     * 更换图片
     * @param path 图片路径
     * @param sp 图片对象
     * @param cb 回调
     */
    protected loadSprite(path:string, sp:cc.Sprite, cb?:Function){
        RES.loadAsset(path, cc.SpriteFrame, (spriteframe,err)=>{
            if (!err && sp) {
                sp.spriteFrame = spriteframe;
            }
            if(cb){
                cb(err?null:spriteframe);
            }
        });
    }

    /**
     * 加载预设
     * @param path 预设路径
     * @param cb 回调
     */
    protected loadPrefab(path:string,cb:Function){
        NodeMng.spawn(path,(instant)=>{
            cb && cb(instant);
        });
    }

    /**
     * 加载预设到节点
     * @param path 预设路径
     * @param parent 父节点
     * @param params 预设初始化参数
     */
    protected loadPrefabToParent(path:string,parent:cc.Node,...params:any[]){
        NodeMng.spawn(path,cc.Prefab,(instant)=>{
            if(parent && instant && cc.isValid(parent)){
                parent.addChild(instant);
            }
        },...params);
    }

    /**
     * 释放资源
     */
    onDestroy(){
        this.poolRef = null;
        if(this.path){
            RES.release(this.path);
        }
    }

    update(dt) {

        if (!this.tickEnable) {
            return;
        }

        // secTick
        this.delayTime += dt;
        if (this.delayTime >= 1) {
            this.tick(this.delayTime);
            this.delayTime = 0;
        }
        // minTick
        this.delayTimeForMin += dt;
        if (this.delayTimeForMin >= 60) {
            this.minTick(this.delayTimeForMin);
            this.delayTimeForMin = 0;
        }

    }

    // 每秒执行
    protected tick(dt) {
    }
    // 每分执行一次
    protected minTick(dt) {
    }
    // update (dt) {}
}


export var NodeMng:NodeManager = NodeManager.getInstance();