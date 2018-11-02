declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}

declare module "*.html" {
    const content: string;
    export default content;
}

declare module "selection-ranges"{
    export function getRange(el:Element):{start:number, end: number}
    export function setRange(el:Element | Node, range:{start:number, end: number}):void
}

declare var require: NodeRequire