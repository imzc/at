namespace at {



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