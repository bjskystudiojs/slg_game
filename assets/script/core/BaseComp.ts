import BasePool from "./BasePool";
import { RES } from "../manager/ResourceManager";

const {ccclass, property} = cc._decorator;
/**
 * 基础组件 by liuxin
 * @description 统一初始化和清理接口:onInit/onDispose、资源卸载，支持加载其他资源的方法
 */
@ccclass
export class BaseComp extends cc.Component {
    protected delayTime: number = 0;
    protected delayTimeForMin: number = 0;
    protected tickEnable: boolean = false;

    private _initParam:any[] = [];
    private _loaded:boolean = false;

    //预设路径,
    public path: string = "";
    public poolRef: BasePool = null;

    /**
     * 使用包含的预设，仅仅将预设相关的json提前加载，提高显示速度，不会作任何操作
     */
    @property([cc.Prefab])
    public containPrefabs: cc.Prefab[] = [];
    

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._loaded = true;
        if(this._initParam){
            this.onInit.apply(this,this._initParam);
        }
    }

    start() {

    }

    /**
     * 调用初始化数据
     * @param params 参数
     */
    public init(...params) {
        this._initParam = params;
        if(this._loaded){
            this.onInit(...params);
        }
    }

    /**
     * onLoad之后的初始化
     * @param params 
     */
    protected onInit(...params){

    }

    /**
     * 调用清理组件
     * @destoryNode 移除节点
     */
    public dispose(destoryNode?: boolean) {
        if (this.poolRef) {
            this.onDispose();
            this.poolRef.returnNode(this.path, this.node);
            this.poolRef = null;
        } else {
            this.onDispose();
            if (destoryNode) {
                this.node.destroy();
            }
        }
    }

    /**
     * 重写清理组件
     */
    protected onDispose() {

    }

    onDestroy() {
        if (this.path) {  //释放资源
            RES.release(this.path);
        }
    }

    /**
     * 加载图片
     * @param path 图片路径
     * @param sp sprite
     * @param cb 回调
     */
    public loadSprite(path: string, sp: cc.Sprite, cb?: Function) {
        RES.loadAsset(path, cc.SpriteFrame, (spriteframe, err) => {
            if (!err && sp) {
                sp.spriteFrame = spriteframe;
            }
            if (cb) {
                cb(err ? null : spriteframe);
            }
        });
    }
    /**
     * 加载图集中的资源
     * @param name 图片名称
     * @param atlasPath 图集路径
     * @param sp sprite
     * @param cb 回调
     */
    public loadSpriteAtlas(name: string, atlasPath: string, sp: cc.Sprite, cb?: Function) {
        RES.loadAsset(atlasPath, cc.SpriteAtlas, (atlas: cc.SpriteAtlas, err) => {
            if (!err && sp) {
                let spriteframe = atlas.getSpriteFrame(name);
                if (spriteframe)
                    sp.spriteFrame = spriteframe;
            }
            if (cb) {
                cb(err ? null : atlas.getSpriteFrame(name));
            }
        });
    }
    /**
     * 创建预制界面实例
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public loadPrefab(path: string, cb: Function, ...params: any[]) {
        RES.loadAsset(path, cc.Prefab, (obj) => {
            let node = cc.instantiate(obj);
            node.active = true;
            let b = node.getComponent(BaseComp) || node.addComponent(BaseComp);
            b.path = path;
            b.init(...params);
            cb && cb(node);
        })
    }

    /**
     * 加载预设到节点
     * @param path 预设路径
     * @param parent 父节点
     * @param params 预设初始化参数
     */
    public loadPrefabToParent(path: string, parent: cc.Node, ...params: any[]) {
        this.loadPrefab(path, cc.Prefab, (instant) => {
            if (parent && instant && cc.isValid(parent)) {
                parent.addChild(instant);
            }
        }, ...params);
    }

    /**
     * 从对象池取出预制界面实例
     * @param pool 对象池
     * @param path 路径
     * @param cb 回调
     * @param params 初始化参数
     */
    public loadPrefabWithPool(pool: BasePool, path: string, cb: Function, ...params: any[]) {
        pool.requestNode(path, (node: cc.Node) => {
            let b = node.getComponent(BaseComp) || node.addComponent(BaseComp);
            b.path = path;
            b.poolRef = pool;
            b.init(...params)
            cb && cb(node);
        });
    }

    update(dt) {

        if (!this.tickEnable) {
            return;
        }

        // secTick
        this.delayTime += dt;
        if (this.delayTime >= 1) {
            this.tick();
            this.delayTime = 0;
        }
        // minTick
        this.delayTimeForMin += dt;
        if (this.delayTimeForMin >= 60) {
            this.minTick();
            this.delayTimeForMin = 0;
        }

    }

    // 每秒执行
    protected tick() {
    }
    // 每分执行一次
    protected minTick() {
    }
    // update (dt) {}
}