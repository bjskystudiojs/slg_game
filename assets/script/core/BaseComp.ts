const {ccclass, property} = cc._decorator;


/**
 * 基础组件 by liuxin
 */
@ccclass
export default class BaseComp extends cc.Component {
    protected delayTime: number = 0;
    protected delayTimeForMin: number = 0;
    protected tickEnable: boolean = false;

    //预设路径,
    public path:string ="";
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
     * 主动卸载
     */
    public dispose(){

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