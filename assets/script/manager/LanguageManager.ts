import { LocalStore, LocalStoreEnum } from "./LocalStoreManager";
import CommonUtil from "../utils/CommonUtil";
import LogUtils from "../utils/LogUtils";
import { RES } from "./ResourceManager";
import { Emitter } from "../core/Emitter";

export enum LanguageEnum {
    EN = "en",
    CN = "cn"
}
/**
 * 语言管理 byliuxin
 */
export default class LanguageManager {
    private static _instance: LanguageManager;
    public static getInstance(): LanguageManager {
        if (!this._instance) {
            this._instance = new LanguageManager();
        }
        return this._instance;
    }

    public static Event_Language_Loaded: string = "Event_Language_Loaded";

    private langJosnPath: string = "Lang/";
    private _lang = LanguageEnum.CN;
    private _langJson: any = null;
    private _langJsonloaded: boolean = false;
    public get languange() {
        return this._lang;
    }

    public init() {
        let curLang = LocalStore.getSystemData(LocalStoreEnum.UserLanguage);
        if (!curLang) {
            curLang = this.getDeviceLanguage();
        } else {
        }
        if (curLang == "zh" || curLang == "cn" || curLang == "zh-CN") {
            this._lang = LanguageEnum.CN;
        }
        LocalStore.setSystemData(LocalStoreEnum.UserLanguage, this._lang);
        RES.loadAsset(this.langJosnPath + this._lang, cc.JsonAsset, (jsonObj) => {
            if(jsonObj.loaded){
                this._langJson = jsonObj.json;
                this._langJsonloaded = true;
                Emitter.emit(LanguageManager.Event_Language_Loaded, this._langJson);
            }
        })
    }

    /**
     * 获取用户设备语言
     */
    public getDeviceLanguage(): LanguageEnum {
        let deviceLanguage;
        if (!cc.sys.isNative || cc.sys.os == cc.sys.OS_OSX) {
            deviceLanguage = cc.sys.language.toLowerCase();
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            deviceLanguage = "cn"
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            deviceLanguage = "cn"
        }
        if (!deviceLanguage) {
            deviceLanguage = "cn";
        }
        LogUtils.log(this, "device language:" + deviceLanguage);
        return deviceLanguage;

    }
    /**
     * 获取文本
     * @param id 语言id
     * @param args 参数
     */
    public getString(id: any, ...args: any[]): string {
        var retStr: string = "";
        if (this._langJsonloaded && this._langJson) {
            var value = this._langJson[id];
            if (value) {
                value = value.replace(/\\n/g, "\n");
                if (arguments.length > 1) {
                    for (var i = 0; i < arguments.length - 1; ++i) {
                        value = value.replace(new RegExp("[{]" + i + "[}]", 'g'), arguments[i + 1]);
                    }
                }
                if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS && value.indexOf("Google+") >= 0) {
                    value = value.replace(new RegExp("Google[+]", 'g'), "Game Center");
                }
            } else {
                value = "???";
            }
            retStr = value;
        } else {
            LogUtils.log(this, "language get failed:not load complete");
        }
        return retStr;
    }
}

export var Language = LanguageManager.getInstance();