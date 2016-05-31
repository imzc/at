namespace at {

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