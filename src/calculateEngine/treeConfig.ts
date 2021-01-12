export type TreeConfig = {
    configID:string;
    root:TreeNodeConfig;
    references:TreeNodeConfig[]
}

export type TreeNodeConfig = {
    instanceID:string;
    unitID:string;
    inputs:InputDefine[];
}

export type InputDefine = {
    type: "ref" | "value";
    value:any;
    index?:number;
}