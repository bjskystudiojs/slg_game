
/**
 * 编辑器嵌套预支界面，网上找的 
 * @description 方便直接在编辑器里面进行预制嵌套
 */
const {ccclass, executeInEditMode, property} = cc._decorator;
@ccclass
@executeInEditMode
export default class LinkPrefab extends cc.Component {
    
    @property
    private _prefab: cc.Prefab = null
    
    @property({type: cc.Prefab, visible: true, displayName: "预制体"})
    set prefab(value: cc.Prefab) {
        this._onPrefabChanged(this._prefab, value)
    }

    get prefab(): cc.Prefab {
        return this._prefab
    }
    private _prefabNode:cc.Node = null;

    private _onPrefabChanged(oldValue:cc.Prefab, newValue:cc.Prefab) {
        this._prefab = newValue
        if (newValue) {
            if(this._prefabNode){
                this._prefabNode.destroy();
            }
            this._prefabNode = cc.instantiate(newValue);
            if(this._prefabNode){
                // cc.Object["Flags"].DontSave          // 当前节点不会被保存到prefab文件里
                // cc.Object["Flags"].LockedInEditor    // 当前节点及子节点在编辑器里不会被点击到
                // cc.Object["Flags"].HideInHierarchy   // 当前节点及子节点在编辑器里不显示
                this._prefabNode["_objFlags"] |= (cc.Object["Flags"].DontSave | cc.Object["Flags"].LockedInEditor | cc.Object["Flags"].HideInHierarchy);
                this.node.addChild(this._prefabNode, -1) // 添加到最底层
            }
        }
    }

    onLoad() {
        this._onPrefabChanged(null, this._prefab)
    }

    /**
     * 获取嵌套预制件绑定的脚本
     */
    public getPrefabComponect<T extends cc.Component>(type: {prototype: T}): T {
        let prefabNode = this._prefabNode
        return prefabNode ? prefabNode.getComponent(type) : null;
    }
}