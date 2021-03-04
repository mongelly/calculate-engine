import { BaseCalculateUnit, CalculateUnitCtx } from "../calculateEngine/baseCalculateUnit";
import { ActionData, ActionResult } from "../utils/components/actionResult";

export default class NormalUnit extends BaseCalculateUnit<boolean>{
    public readonly unitID:string = "00000000-0000-0000-0001-3424e55bf0d5";
    public readonly unitName:string = "Builtin-NormalUnit";

    public async calculate(ctx: CalculateUnitCtx): Promise<ActionData<boolean>> {
        return await ctx.inputs[0];
    }

    public async checkCtx(ctx: CalculateUnitCtx): Promise<ActionResult> {
        let result = new ActionResult();
        if(ctx.inputs != undefined && ctx.inputs.length == 1){
        } else {
            result.error = new Error("inputs invalid");
        }
        return result;
    }

    public async checkInstanceConfig(instanceConfig:any|undefined):Promise<ActionResult>{
        return new ActionResult(true);
    }
}