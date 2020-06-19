
/**
 * 统一的log 工具 by liuxin
 */
export default class LogUtils {
    static isOpen: boolean = false;
    static showTarget: boolean = false; 

    static warn(target: any, msg: any, ...subst: any[]): void {
        if (this.showTarget) {
            msg = "[" + target.constructor.name + "]" + msg;
        }
        if (this.isOpen) {
            if (cc.sys.isNative) {
                console.log(msg, subst);
            }
            else {
                cc.warn(msg, subst);
            }
        }
    }

    static log(target: any, msg: any, ...subst: any[]): void {
        if (this.showTarget) {
            msg = "[" + target.constructor.name + "]" + msg;
        }
        if (this.isOpen) {
            if (cc.sys.isNative) {
                console.log(msg, subst);
            }
            else {
                cc.log(msg, subst);
            }
        }
    }

    static error(target: any, msg: any, ...subst: any[]): void {
        if (this.showTarget) {
            msg = "[" + target.constructor.name + "]" + msg;
        }
        if (this.isOpen) {
            if (cc.sys.isNative) {
                console.log(msg, subst);
            }
            else {
                cc.error(msg, subst);
            }
        }
    }
}