module demo {

    @at.skin("resource/eui_skins/DemoSkin.exml")
    export class MyComponent extends eui.Component {
        
        @at.partEvent<MyComponent>(egret.TouchEvent.TOUCH_BEGIN, it => it.onTouchBegin)
        @at.partEvent<MyComponent>(egret.TouchEvent.TOUCH_BEGIN, it => it.onTouchBegin)
        @at.partReady<MyComponent>(it => it.onReady)
        public btnAdd: eui.Button;

        public onTouchBegin(e: egret.TouchEvent) {
            console.log("begin");
        }
        public onTouchEnd(e: egret.TouchEvent) {
            console.log("end");
        }
        public onTouchTap(e: egret.TouchEvent) {
            console.log("tap");
        }
        public onReady() {
            console.log("ready");
        }

        public static Abc = 456;
    }

    export class NewComp extends MyComponent {

        public onTouchBegin(e: egret.TouchEvent) {
            console.log("_over begin");
        }
    }
}