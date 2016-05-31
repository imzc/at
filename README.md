# At!

At! 是一组 Egret 引擎使用的 Decorators, 利用 Decorators 简化代码，接触耦合！

## RES 加载示例
下面的代码是`eui`项目的入口类，用`at.res`替换了原来大量的RES加载代码，使主要逻辑更加清晰。

```typescript
@at.res({
    url:"resource/default.res.json",
    root:"resource/",
    preload:"preload",
    onPreloadComplete:Main.prototype.onResLoadComplete
})
class Main extends eui.UILayer {
        
    private onResLoadComplete(): void {
        this.startCreateScene();
    }
    
    private startCreateScene(): void {
        var button = new eui.Button();
        button.label = "Click!";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
    }
}

```


## EUI 示例

### 简化皮肤部件事件注册

```typescript
module demo {
    
    export class Component extends eui.Component {
        
        constructor(){
            super();
            this.skinName = "resource/eui_skins/DemoSkin.exml";
        }
        
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

```
