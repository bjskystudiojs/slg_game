export default class HotUpdater{

    private _timeout:number;
    public checkUpdate(sucess:Function,failed:Function){
        //测试
        this._timeout = setTimeout(sucess,100);

    }

    public dispose(){
        clearTimeout(this._timeout);
    }
}