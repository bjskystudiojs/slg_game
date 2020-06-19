import PlayerData from "./PlayerData";

/**
 * 游戏数据 by liuxin
 */
export default class GameDataCenter{

    private static _instance:GameDataCenter;
    public static getInstance():GameDataCenter{
        if(!this._instance){
            this._instance = new GameDataCenter();
        }
        return this._instance;
    }

    public player:PlayerData = null;
}

export var GameData = GameDataCenter.getInstance();

