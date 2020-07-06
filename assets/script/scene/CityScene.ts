import DragableScene from "../core/DragableScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CityScene extends DragableScene {
    public init(){
        super.init();

        this.initMap();
        this.initUI();
    }
    

    private initMap(){

    }

    private initUI(){
        
    }

    public dispose(){
        super.dispose();

    }
}