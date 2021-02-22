
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
        this.containerResult = new ContainerResult();
        this.containerResult.baseInfo = {instanceID:this.instanceID,unitID:this.unitID,unitName:this.unitName,executed:this.executed};
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

    public get executed():boolean {
        return this._executed;
    }

    public containerResult:ContainerResult = new ContainerResult();

    public async exec(context:any):Promise<ActionData<any>>{
        let result = new ActionData<any>();
        this._executed = true;
        this.containerResult.baseInfo.executed = this._executed;
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
            if(!checkInstanceConfigResult.succeed){
                let faildResult = new ActionResult();
                faildResult.copyBase(checkInstanceConfigResult);
                this.containerResult.result = faildResult;

                result.succeed = true;
                result.data = false;
                return result; 
            }
        } catch (error) {
            result.error = error;
            result.succeed = false;
            this.containerResult.result = result;
        }

        try {
            let checkResult = await this._unit.checkCtx(unitCtx);
            if(checkResult.succeed){
                let execResult = await this._unit.calculate(unitCtx);
                if(execResult.succeed){
                    result.data = execResult.data;
                    result.succeed = true;
                    this.containerResult.result = result;
                } else {
                    let faildResult = new ActionResult();
                    faildResult.copyBase(checkResult);
                    this.containerResult.result = faildResult;
                }
            } else {
                let faildResult = new ActionResult();
                faildResult.copyBase(checkResult);
                this.containerResult.result = faildResult;
            }

            for(let sub of this._subContainer){
                this.containerResult.subResults.set(sub.instanceID,sub.containerResult);
            }

        } catch (error) {
            result.error = error;
            result.succeed = false;
            this.containerResult.result = result;
        }

        return result;
    }

    private _unit:BaseCalculateUnit<any>;
    private _env:any;
    private _instanceConfig:InstanceConfig|undefined;
    private _subContainer:Array<CalculateContainer> = new Array();
    private _instanceID:string;
    private _executed:boolean = false;
}

export class ContainerResult{
    public result:ActionResult = new ActionResult();
    public baseInfo:ContainerBaseInfo = new ContainerBaseInfo();
    public subResults:Map<string,ContainerResult> = new Map();
    public executed:boolean = false;
}

export class ContainerBaseInfo{
    public instanceID:string = "";
    public unitID:string = "";
    public unitName:string = "";
    public executed:boolean = false;
}
