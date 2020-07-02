import { SceneEnum } from "../manager/SceneManager";

/**
 * 场景切换动画 by liuxin
 */
export default class SceneTransfer{

    constructor(from:SceneEnum,to:SceneEnum){
        this._sceneFrom = from;
        this._sceneTo = to;
    }
    private _sceneFrom:SceneEnum;
    private _sceneTo:SceneEnum;
    

    public exitTransfer(cb:Function){
        if(this._sceneFrom == SceneEnum.CityScene && this._sceneTo == SceneEnum.WorldScene){
            //主城切世界退出
            cb && cb();
        }else if(this._sceneFrom == SceneEnum.WorldScene && this._sceneTo == SceneEnum.CityScene){
            //世界切主城退出
            cb && cb();
        }else{
            cb && cb();
        }
    }

    public enterTransfer(cb:Function){
        if(this._sceneFrom == SceneEnum.CityScene && this._sceneTo == SceneEnum.WorldScene){
            //主城切世界进入
            cb && cb();
        }else if(this._sceneFrom == SceneEnum.WorldScene && this._sceneTo == SceneEnum.CityScene){
            //世界切主城进入
            cb && cb();
        }else{
            cb && cb();
        }
    }
}