import { BaseCalculateUnit, CalculateUnitCtx } from "../calculateEngine/baseCalculateUnit";
import { ActionData, ActionResult } from "../utils/components/actionResult";

export default class StaticBaseCalculateUnit extends BaseCalculateUnit<any> {

    public readonly unitID:string = "00000000-0000-0000-0001-000000000001";
    public readonly unitName:string = "Builtin-StaticUnit"

    public constructor(value:any){
        super();
        this._value = value;
    }

    public async calculate(ctx: CalculateUnitCtx): Promise<ActionData<any>> {
        let result = new ActionData<any>();
        result.data = this._value;
        return result;
    }
    public async checkCtx(ctx: CalculateUnitCtx): Promise<ActionResult> {
        let result = new ActionResult();
        return result;
    }

    public async checkInstanceConfig(instanceConfig:any|undefined):Promise<ActionResult>{
        return new ActionResult(true);
    }

    private _value:any;
}