import { Platform } from "../manager/PlatformManager";
import { Emitter } from "../core/Emitter";
import { Language } from "../manager/LanguageManager";
import HotUpdater from "../utils/HotUpdater";
import { Config } from "../manager/ConfigManager";
import { Module } from "../manager/ModuleManager";
import { BaseComp } from "../core/BaseComp";
import { ResConst } from "../const/ResConst";
import { PreloadResBean, RES } from "../manager/ResourceManager";

export default class LoadingModule extends BaseComp {
    public static Event_Loading_complete: string = "Event_Loading_complete";
    public static Event_Loading_progress: string = "Event_Loading_progress";
    public static Event_Loading_TipChange: string = "Event_Loading_TipChange";

    private _currentState: LoadingState;

    private _loading: boolean = false;

    public startLoading() {
        if (this._loading) {
            return;
        }
        this._loading = true;
        this._currentState = new LoadingCheckUpdate(this);
        this._currentState.enter();
    }

    public setState(state: LoadingState) {
        if (this._currentState) {
            this._currentState.exit();
        }
        this._currentState = state;
        this._currentState.enter();
    }

    public setTip(tip: string) {
        Emitter.emit(LoadingModule.Event_Loading_TipChange, tip);
    }

    public setProgress(pro: number, state: LoadingStateEnum) {
        var totalPro: number;
        pro /= 100;
        if (state == LoadingStateEnum.CheckUpdate) {
            totalPro = pro * 0.1;
        } else if (state == LoadingStateEnum.PlatLogin) {
            totalPro = 0.1 + pro * 0.15;
        } else if (state == LoadingStateEnum.LoadCfg) {
            totalPro = 0.25 + pro * 0.05;
        } else if (state == LoadingStateEnum.ConnectServer) {
            totalPro = 0.3 + pro * 0.15;
        } else if (state == LoadingStateEnum.LoadRES) {
            totalPro = 0.45 + pro * 0.55;
        }
        Emitter.emit(LoadingModule.Event_Loading_progress, totalPro);
    }

    public loadComplete() {
        this._currentState.exit();
        this._currentState = null;
        Emitter.emit(LoadingModule.Event_Loading_complete);
    }


    public update(dt) {
        super.update(dt);
        if (this._currentState) {
            this._currentState.update(dt);
        }
    }
}

/**
 * 登录状态枚举
 */
export enum LoadingStateEnum {
    LoadCfg = "loadCfg",        //加载配置
    LoadRES = "loadRes",        //加载资源
    PlatLogin = "platLogin",    //平台登录
    ConnectServer = "connectServer",    //连接服务器
    CheckUpdate = "checkUpdate",    //检查更新
    HotUpdate = "hotUpdate",    //热更新中
}

/**
 * 登录状态
 */
export class LoadingState {
    public state: LoadingStateEnum;
    protected _module: LoadingModule;
    constructor(module: LoadingModule) {
        this._module = module;
    }
    //执行
    public enter() {

    }
    //结束
    public exit() {
        this._module = null;
    }

    public update(dt) {

    }

    public setProgress(pro) {
        this._module.setProgress(pro, this.state);
    }
}

/**
 * 平台登录状态
 */
export class LoadingPlatLogin extends LoadingState {
    constructor(module: LoadingModule) {
        super(module);
        this.state = LoadingStateEnum.PlatLogin;
    }

    public enter() {
        this._module.setTip(Language.getString("loadingPlatlogin"));
        Platform.login(this.loginSuccess.bind(this), this.loginFailed.bind(this));
    }

    private loginSuccess() {
        this.setProgress(100);
        this._module.setState(new LoadingLoadConfig(this._module))
    }

    private loginFailed() {
        this._module.setState(new LoadingPlatLogin(this._module))

    }
}
/**
 * 检查更新状态
 */
export class LoadingCheckUpdate extends LoadingState {
    constructor(module: LoadingModule) {
        super(module);
        this.state = LoadingStateEnum.CheckUpdate;
    }
    private _updater: HotUpdater;
    public enter() {
        this._module.setTip(Language.getString("loadingCheckUpdate"));
        this._updater = new HotUpdater();
        this._updater.checkUpdate(this.checkUpdateSuccess.bind(this), this.checkUpdateFailed.bind(this));
    }

    private checkUpdateSuccess() {
        this.setProgress(100);
        this._module.setState(new LoadingPlatLogin(this._module));
    }

    private checkUpdateFailed() {
        this._module.setState(new LoadingCheckUpdate(this._module));
    }

    public exit() {
        super.exit();
        this._updater.dispose();
        this._updater = null;
    }
}

/**
 * 连接服务器状态
 */
export class LoadingConnectServer extends LoadingState {
    constructor(module: LoadingModule) {
        super(module);
        this.state = LoadingStateEnum.ConnectServer;
    }
    private _timeout: number;
    public enter() {
        this._module.setTip(Language.getString("loadingConnectServer"));
        this._timeout = setTimeout(this.connectTest.bind(this), 100);
    }

    private connectTest() {
        Module.building.initBuildingData();
        this.connectSucess();
    }

    private connectSucess() {
        this.setProgress(100);
        this._module.setState(new LoadingLoadRes(this._module));
    }

    private connectFailed() {
        this._module.setState(new LoadingConnectServer(this._module));
    }
    public exit() {
        super.exit();
        clearTimeout(this._timeout);
    }
}

/**
 * 加载客户端
 */
export class LoadingLoadConfig extends LoadingState {
    constructor(module: LoadingModule) {
        super(module);
        this.state = LoadingStateEnum.ConnectServer;
    }
    public enter() {
        this._module.setTip(Language.getString("loadingConfig"));
        Config.init(this.loadSuccess.bind(this));
    }

    private loadSuccess() {
        this.onSucess();
    }

    private onSucess() {
        this.setProgress(100);
        this._module.setState(new LoadingConnectServer(this._module));
    }

    private onFailed() {
        this._module.setState(new LoadingLoadConfig(this._module));
    }
    public exit() {
        super.exit();
    }
}

/**
 * 预加载资源状态
 */
export class LoadingLoadRes extends LoadingState {
    constructor(module: LoadingModule) {
        super(module);
        this.state = LoadingStateEnum.LoadRES;
    }

    private loadingResAtlasList: Array<PreloadResBean> = [
        new PreloadResBean(ResConst.AtlasBuilding, cc.SpriteAtlas),
        new PreloadResBean(ResConst.AtlasCommon, cc.SpriteAtlas),
        new PreloadResBean(ResConst.AtlasMainUI, cc.SpriteAtlas),
        new PreloadResBean(ResConst.AtlasXindibiao, cc.SpriteAtlas)
    ]

    private progress: number = 0;
    private loading: boolean = false;
    public enter() {
        this._module.setTip(Language.getString("loadingLoadRes", 0));
        this.progress = 0;
        this.loading = true;
        // RES.preloadAsset(this.loadingResAtlasList, this.onProgress.bind(this), this.onComplete.bind(this));
        this.onComplete();
    }

    private onProgress(cur, total) {
        this.progress = 100 * cur / total;
        if (this.progress > 100) {
            this.progress = 100;
        }
        this._module.setTip(Language.getString("loadingLoadRes", ~~this.progress));
        this.setProgress(this.progress);
    }
    private onComplete() {
        this.progress = 100;
        this.loading = false;
        this._module.loadComplete();

    }

}
