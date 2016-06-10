namespace at {
    export interface IResOption<T> {
        url?: string;
        root?: string;
        preload: string;
        progress?: (it:T)=> (loaded: number, total: number) => void;
        faild?:  (it:T)=>(e: RES.ResourceEvent) => void;
        finish?:  (it:T)=>(e: RES.ResourceEvent) => void;
        itemError?:  (it:T)=>(e: RES.ResourceEvent) => void;
    }
    export function res<T>(options: IResOption<T>) {
        return function (target: { new (...args): egret.DisplayObject }): any {
            return $appendToClass(target,it=>new ResHelper(it,options));
        }
    }

    class ResHelper<T> {
        constructor(private target: egret.DisplayObject, private options: IResOption<T>) {
            if(options.url){
                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.loadPreload, this);
                RES.loadConfig(options.url, options.root);
            }
            else {
                this.loadPreload(null);
            }
        }

        /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
        private loadPreload(event: RES.ResourceEvent): void {
            var options = this.options;
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.loadPreload, this);
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

                if (options.finish) {
                    options.finish.call(this.target,this.target).call(this.target, this.options.preload);
                }
            }
        }
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event: RES.ResourceEvent): void {
            if (this.options.itemError) {
                this.options.itemError.call(this.target,this.target).call(this.target, event);
            }
        }
        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onGroupLoadError(event: RES.ResourceEvent): void {
            var options = this.options;
            if (options.faild) {
                options.faild.call(this.target,this.target).call(this.target, event);
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
            if (options.progress && event.groupName == options.preload) {
                options.progress.call(this.target,this.target).call(this.target, event.itemsLoaded, event.itemsTotal);
            }
        }
    }
}