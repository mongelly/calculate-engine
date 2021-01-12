import { BaseCalculateUnit, CalculateUnitCtx } from "../calculateEngine/baseCalculateUnit";
import { ActionData, ActionResult } from "../utils/components/actionResult";

export default class AndUnit extends BaseCalculateUnit<boolean>{

    public readonly unitID:string = "00000000-0000-0000-0001-3336ad58a20e";
    public readonly unitName:string = "Builtin-AndUnit";

    public async calculate(ctx: CalculateUnitCtx): Promise<ActionData<boolean>> {
        let result = new ActionData<boolean>();
        try {
            for(let input of ctx.inputs){
                let re = await input;
                if(re.succeed){
                    result.data = re.data;
                    if(!result.data){
                        break;
                    }
                } else {
                    result.copyBase(re);
                    return result;
                }
            }
            result.succeed = true;
        } catch (error) {
            result.error = error;
            result.succeed = false;
            return result;
        }
        return result;
    }
    public async checkCtx(ctx: CalculateUnitCtx): Promise<ActionResult> {
        let result = new ActionResult();
        if(ctx.inputs != undefined && ctx.inputs.length >= 2){
            result.succeed = true;
        } else {
            result.error = new Error("inputs invalid");
            result.succeed = false;
        }
        return result;
    }
}