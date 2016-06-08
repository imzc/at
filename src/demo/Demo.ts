module demo {
    
    @at.skin("resource/eui_skins/DemoSkin.exml")
    export class Component extends eui.Component {
        
        @at.partEvent(egret.TouchEvent.TOUCH_TAP,Component.prototype.onTouchTap)
        @at.partEvent(egret.TouchEvent.TOUCH_END,Component.prototype.onTouchEnd)
        @at.partReady(Component.prototype.onReady)
        public btnAdd:eui.Button;
        
        public onTouchBegin(e:egret.TouchEvent) {
            console.log("begin");
        }
        public onTouchEnd(e:egret.TouchEvent) {
            console.log("end");
        }
        public onTouchTap(e:egret.TouchEvent) {
            console.log("tap");
        }
        public onReady() {
            console.log("ready");
        }
    }
}