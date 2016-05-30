namespace at {
    export interface IResConfig {
        url: string;
        root: string;
        preload: string;
        onProgress?: (loaded: number, total: number) => void;
        onPreloadFaild?: (e: RES.ResourceEvent) => void;
        onPreloadComplete?: (e: RES.ResourceEvent) => void;
        onItemLoadError?: (e: RES.ResourceEvent) => void;
    }
    export function res(options:IResConfig) {
        return function (target: { new (...args): egret.DisplayObject }):any {
            var newFunc = function (...args) {
                var instance = new target(...args);
                var helper = new ResHelper(instance,options);
                return instance;
            }
            return newFunc;
        }
    }

    class ResHelper {
        constructor(private target: egret.DisplayObject, private options: IResConfig) {
            target.once(egret.Event.ADDED_TO_STAGE, () => {
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
                RES.loadConfig(options.url, options.root);
            }, target);
        }

        /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
        private onConfigComplete(event: RES.ResourceEvent): void {
            var options = this.options;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            RES.loadGroup(this.options.preload);
        }
        /**
         * preload资源组加载完成
         * preload resource group is loaded
         */
        private onGroupLoadComplete(event: RES.ResourceEvent): void {
            var options = this.options;
            if (event.groupName == options.preload) {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupLoadComplete, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);

                if (options.onPreloadComplete) {
                    options.onPreloadComplete.call(this.target, this.options.preload);
                }
            }
        }
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event: RES.ResourceEvent): void {
            if (this.options.onItemLoadError) {
                this.options.onItemLoadError.call(this.target, event);
            }
        }
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onGroupLoadError(event: RES.ResourceEvent): void {
            var options = this.options;
            if (options.onPreloadFaild) {
                options.onPreloadFaild.call(this.target, event);
            }
            else {
                this.onGroupLoadComplete(event);
            }
        }
        /**
     * preload资源组加载进度
     * loading process of preload resource
     */
        private onResourceProgress(event: RES.ResourceEvent): void {
            var options = this.options;
            if (options.onProgress && event.groupName == options.preload) {
                options.onProgress.call(this.target, event.itemsLoaded, event.itemsTotal);
            }
        }
    }
}