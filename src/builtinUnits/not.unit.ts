import { BaseCalculateUnit, CalculateUnitCtx } from "../calculateEngine/baseCalculateUnit";
import { ActionData, ActionResult } from "../utils/components/actionResult";

export default class NotUnit extends BaseCalculateUnit<boolean>{

    public readonly unitID:string = "00000000-0000-0000-0001-81f8dbd25d7e";
    public readonly unitName:string = "Builtin-NotUnit";

    public async calculate(ctx: CalculateUnitCtx): Promise<ActionData<boolean>> {
        let result = await ctx.inputs[0];
        result.data = !result.data;
        return result;
    }
    
    public async checkCtx(ctx: CalculateUnitCtx): Promise<ActionResult> {
        let result = new ActionResult();
        if(ctx.inputs != undefined && ctx.inputs.length == 1){
            result.succeed = true;
        } else {
            result.error = new Error("inputs invalid");
            result.succeed = false;
        }
        return result;
    }

    public async checkInstanceConfig(instanceConfig:any|undefined):Promise<ActionResult>{
        return new ActionResult(true);
    }
}