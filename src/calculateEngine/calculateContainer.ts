
import { ActionData, ActionResult } from "../utils/components/actionResult";
import { BaseCalculateUnit, CalculateUnitCtx } from "./baseCalculateUnit";
import { InstanceConfig } from "./instanceConfig";

export class CalculateContainer{
    constructor(instanceID:string,unit:BaseCalculateUnit<any>,env:any|undefined,instanceConfg:InstanceConfig|undefined,subContainer:Array<CalculateContainer>|undefined){
        this._instanceID = instanceID;
        this._unit = unit;
        this._env = env;
        this._instanceConfig = instanceConfg;
        this._subContainer = subContainer || new Array();
        for(let sub of this._subContainer){
            sub.results = this.results;
        }
    }

    public get unitID():string {
        return this._unit.unitID;
    }

    public get unitName():string {
        return this._unit.unitName;
    }

    public get instanceID():string {
        return this._instanceID;
    }

    public results:ContainerResults = new ContainerResults();

    public async exec(context:any):Promise<ActionData<any>>{
        let result = new ActionData<any>();
        let unitCtx:CalculateUnitCtx = {
            instanceID:this.instanceID,
            env:this._env,
            context:context,
            inputs:new Array<Promise<ActionData<any>>>(),
            instanceConfig:this._instanceConfig?.configs.find(config => {return config.instanceID == this.instanceID})?.config
        };

        for(let sub of this._subContainer){
            unitCtx.inputs.push(sub.exec(context));
        }

        try {
            let checkInstanceConfigResult = await this._unit.checkInstanceConfig(unitCtx.instanceConfig);
            if(checkInstanceConfigResult.succeed){

            } else {
                let faildResult = new ActionResult();
                faildResult.copyBase(checkInstanceConfigResult);
                this.results.failed.set(this.instanceID,faildResult);
            }
        } catch (error) {
            result.error = error;
            result.succeed = false;
            this.results.failed.set(this.instanceID,result);
        }



        try {
            let checkResult = await this._unit.checkCtx(unitCtx);
            if(checkResult.succeed){
                let execResult = await this._unit.calculate(unitCtx);
                if(execResult.succeed){
                    result.data = execResult.data;
                    result.succeed = true;
                    this.results.succeed.set(this.instanceID,result);
                } else {
                    let faildResult = new ActionResult();
                    faildResult.copyBase(checkResult);
                    this.results.failed.set(this.instanceID,faildResult);
                }
            } else {
                let faildResult = new ActionResult();
                faildResult.copyBase(checkResult);
                this.results.failed.set(this.instanceID,faildResult);
            }
        } catch (error) {
            result.error = error;
            result.succeed = false;
            this.results.failed.set(this.instanceID,result);
        }

        return result;
    }

    private _unit:BaseCalculateUnit<any>;
    private _env:any;
    private _instanceConfig:InstanceConfig|undefined;
    private _subContainer:Array<CalculateContainer> = new Array();
    private _instanceID:string;
}

export class ContainerResults{
    public succeed:Map<string,ActionData<any>> = new Map();
    public failed:Map<string,ActionResult> = new Map();
}