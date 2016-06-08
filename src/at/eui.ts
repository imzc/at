namespace at {

    export interface IEUIOption {
        theme?:string;
        themeAdapter?:{ new():eui.IThemeAdapter };
        assetAdapter?:{ new():eui.IAssetAdapter };
        onComplete?:()=>void;
        
    }

    export function ui(options:IEUIOption){
        return function (target: { new (...args): egret.DisplayObject }): any {
            var newFunc = function (...args) {
                var instance = new target(...args);
                var helper = new ThemeHelper(instance, options);
                return instance;
            }
            return newFunc;
        }
    }
    
    class ThemeHelper {
        constructor(private target: egret.DisplayObject, private options: IEUIOption) {
            target.once(egret.Event.ADDED_TO_STAGE, () => {
                if(options.assetAdapter){
                    var assetAdapter = new options.assetAdapter();
                    target.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
                }
                if(options.themeAdapter){
                    var themeAdapter = new options.themeAdapter();
                    target.stage.registerImplementation("eui.IThemeAdapter",themeAdapter);
                }
                if(options.theme){
                    var theme = new eui.Theme(options.theme,target.stage);
                    if(options.onComplete){
                        theme.addEventListener(egret.Event.COMPLETE,options.onComplete,target);
                    }
                }
            }, target);
        }
    }
    
    export function skin(skinName:string) {
        return function (target: { new (...args): eui.Component }): any {
            var newFunc = function (...args) {
                var instance = new target(...args);
                instance.skinName = skinName;
                return instance;
            }
            return newFunc;
        }
    }

    export interface EuiPendings {
        skinPartAttrs?: { [name: string]: EuiSkinPartAttrs };
        partAddedReplaced?:boolean;
    }

    export interface EuiSkinPartAttrs {
        handlers: IEventHandlers[];
    }

    export function skinPart(prototype: eui.Component, propName: string) {

    }
    
    export function partReady(handler:()=>void){
        return function (prototype: eui.Component, propName: string) {
            var pending = overridePartAdded(prototype);
            var attrs = getSkinPartAttr(pending,propName);
            attrs.handlers.push({
                name:egret.Event.ADDED_TO_STAGE,
                handler:handler,
                once:true
            });
        };
    }
    export function partEvent(eventType: string, handler: (e: egret.Event) => void) {
        return function (prototype: eui.Component, propName: string) {
            var pending = overridePartAdded(prototype);
            var attrs = getSkinPartAttr(pending,propName);
            attrs.handlers.push({
                name:eventType,
                handler:handler
            });
        };
    }

    function overridePartAdded(prototype: eui.Component):EuiPendings {
        var pendings:EuiPendings = getEuiPending(prototype);
        if(pendings.partAddedReplaced){
            return pendings;
        }
        pendings.partAddedReplaced = true;
        pendings.skinPartAttrs = { };
        var rawPartAdded: (partName: string, instance: any) => void = prototype['partAdded'];
        var rawPartRemoved: (partName: string, instance: any) => void = prototype['partRemoved'];
        var partAddedReplacement = function (partName: string, instance: any): void {
            rawPartAdded.call(this,partName,instance);
            if(pendings.skinPartAttrs){
                var attrs = pendings.skinPartAttrs[partName];
                if(attrs){
                    $addEventHandlers(this,attrs.handlers);
                }
            }
        }
        var partRemovedReplacement = function (partName: string, instance: any): void {
            rawPartRemoved.call(this,partName,instance);
            if(pendings.skinPartAttrs){
                var attrs = pendings.skinPartAttrs[partName];
                if(attrs){
                    $removeEventHandlers(this,attrs.handlers);
                }
            }
        }
        prototype['partAdded'] = partAddedReplacement;
        return pendings;
    }
    
    function getEuiPending(prototype: eui.Component):EuiPendings{
        var pendings:EuiPendings = prototype['__at.eui.pending'];
        if(!pendings){
            pendings = prototype['__at.eui.pending'] = {};
        }
        return pendings;
    }
    
    function getSkinPartAttr(pending:EuiPendings,name:string):EuiSkinPartAttrs{
        if(!pending.skinPartAttrs){
            pending.skinPartAttrs = {};
        }
        if(!pending.skinPartAttrs[name]){
            pending.skinPartAttrs[name] = {
                handlers:[]
            }
        }
        return pending.skinPartAttrs[name];
    }
}