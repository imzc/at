namespace at {

    export function $extends(_override, base) {
        for (var p in base)
            if (base.hasOwnProperty(p))
                _override[p] = base[p];
        function __() {
            this.constructor = _override;
        }
        __.prototype = base.prototype;
        _override.prototype = new __();
    }

    export function $appendToClass<T>(base: { new (...args): T },callback: (instance: T) => void) {
        var newFunc = function (...args) {
            base.apply(this, args);
            callback.call(this,this);
        }
        $extends(newFunc, base);
        return newFunc;
    }

    export interface IEventHandlers {
        name: string;
        handler: (e: egret.Event) => void;
        once?: boolean;
    }
    export function $addEventHandlers(target: egret.IEventDispatcher, handers: IEventHandlers[]) {
        if (!handers) {
            return;
        }
        handers.forEach(t => {
            if (t.once) {
                target.once(t.name, t.handler, target);
            }
            else {
                target.addEventListener(t.name, t.handler, target)
            }
        });
    }
    export function $removeEventHandlers(target: eui.Component, handers: IEventHandlers[]) {
        if (!handers) {
            return;
        }
        handers.forEach(t => target.removeEventListener(t.name, t.handler, target));
    }
}