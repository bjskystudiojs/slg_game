import { GameData } from "../model/GameDataCenter";

/**
 * 本地存储管理 byliuxin
 */
export default class LocalStoreManager {
    private static _instance: LocalStoreManager;
    public static getInstance(): LocalStoreManager {
        if (!this._instance) {
            this._instance = new LocalStoreManager();
        }
        return this._instance;
    }

    private setItem(k, v) {

        cc.sys.localStorage.setItem(k, JSON.stringify(v));
    }
    private removeItem(k) {
        cc.sys.localStorage.removeItem(k);
    }
    private getItem(k) {

        var v = cc.sys.localStorage.getItem(k);
        if (v) {
            return JSON.parse(v);
        } else {
            return null;
        }
    }
    private clear() {
        cc.sys.localStorage.clear();
    }

    private formatKey(id,type){
        return (type==1)?("local.system."+id):("local.user." + GameData.player.sessionId+"."+id);
    }

    /**
     * 设置用户数据
     * @param key 
     * @param val 
     */
    public setUserData(key,val){
        let fKey = this.formatKey(key,2);
        this.setItem(fKey,val);
    }
    
    /**
     * 获取用户数据
     * @param key 
     */
    public getUserData(key){
        let fKey = this.formatKey(key,2);
        return this.getItem(fKey);
    }

    /**
     * 删除用户数据
     * @param key 
     */
    public delUserData(key){
        let fKey = this.formatKey(key,2);
        return this.removeItem(fKey);
    }

    /**
     * 设置系统数据
     * @param key 
     * @param val 
     */
    public setSystemData(key,val){
        let fKey = this.formatKey(key,1);
        this.setItem(fKey,val);
    }
    
    /**
     * 获取系统数据
     * @param key 
     */
    public getSystemData(key){
        let fKey = this.formatKey(key,1);
        return this.getItem(fKey);
    }

    /**
     * 删除系统数据
     * @param key 
     */
    public delSystemData(key){
        let fKey = this.formatKey(key,1);
        return this.removeItem(fKey);
    }
}

export var LocalStore = LocalStoreManager.getInstance();


export enum LocalStoreEnum{
    UserLanguage = "UserLanguage",
}