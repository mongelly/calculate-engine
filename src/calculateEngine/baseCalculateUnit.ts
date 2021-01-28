import { ActionData, ActionResult } from "../utils/components/actionResult";

export abstract class BaseCalculateUnit<T>{
    readonly unitID:string = "";
    readonly unitName:string = "";

    abstract calculate(ctx:CalculateUnitCtx):Promise<ActionData<T>>
    abstract checkCtx(ctx:CalculateUnitCtx):Promise<ActionResult>;
    abstract checkInstanceConfig(instanceConfig:any|undefined):Promise<ActionResult>;
}

export type CalculateUnitCtx = {
    instanceID:string;
    env:any|null;
    context:any|null;
    inputs:Array<Promise<ActionData<any>>>;
    instanceConfig:any|undefined;
}