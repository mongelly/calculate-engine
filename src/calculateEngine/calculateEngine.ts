
import { ActionData } from "../utils/components/actionResult";
import { BaseCalculateUnit } from "./baseCalculateUnit";
import { CalculateContainer } from "./calculateContainer";
import { InstanceConfig } from "./instanceConfig";
import { TreeConfig, TreeNodeConfig } from "./treeConfig";
import {v4 as uuid} from 'uuid';
import StaticBaseCalculateUnit from "../builtinUnits/staticvalue.unit";

export default class CalculateEngine {
    
    public static async calculateUnitBuilder(env:any,treeconfig:TreeConfig,instanceConfg:InstanceConfig|undefined,units:Map<string,BaseCalculateUnit<any>>):Promise<ActionData<CalculateContainer>>{
        let builderInstance = new CalculateEngine(env,treeconfig,instanceConfg,units);
        return builderInstance.containerBuilder(treeconfig.root,new Array());
    }
    
    private constructor(env:any,treeconfig:TreeConfig,instanceConfg:InstanceConfig|undefined,units:Map<string,BaseCalculateUnit<any>>){
        this._env = env;
        this._treeconfig = treeconfig;
        this._instanceConfg = instanceConfg;
        this._units = units;
    }

    private async containerBuilder(treeconfig:TreeNodeConfig,parents:Array<string>):Promise<ActionData<CalculateContainer>>{
        let result = new ActionData<CalculateContainer>();

        if(!this._units.has(treeconfig.unitID)){
            result.error = CalculateEngineError.UnitNotFound(treeconfig.unitID);
            return result;
        }

        let newUnit = Object.create(this._units.get(treeconfig.unitID)!);
        let subContainers = new Array<CalculateContainer>();

        let container:CalculateContainer;

        if(newUnit.__proto__.unitName == "Builtin-StaticUnit") {
            let staticUnit = new StaticBaseCalculateUnit(treeconfig.inputs[0].value || "");
            container = new CalculateContainer(treeconfig.instanceID,staticUnit,this._env,this._instanceConfg,undefined);
        } else {
            if(treeconfig.inputs.length > 0){
                let sorted = treeconfig.inputs.sort((l,r) => (l.index || 0) - (r.index || 0));
                for(const input of sorted){
                    switch(input.type){
                        case "value":
                            let staticUnit = new StaticBaseCalculateUnit(input.value);
                            let container = new CalculateContainer(uuid(),staticUnit,this._env,undefined,undefined);
                            subContainers.push(container);
                            break;
                        case "ref":
                            let refID = input.value;
                            let subConfig = this._treeconfig.references.find(ref => { return ref.instanceID == refID; });
                            if(subConfig == undefined){
                                result.error = CalculateEngineError.UnitNotFound(refID);
                                return result;
                            }
    
                            if(parents.find(id => id == subConfig!.instanceID) != undefined){
                                result.error = CalculateEngineError.UnitInstanceInLoop(subConfig!.instanceID);
                                return result;
                            }
                            
                            let subContainerResult = await this.containerBuilder(subConfig,parents.concat(treeconfig.instanceID));
                            if(subContainerResult.error == undefined){
                                subContainers.push(subContainerResult.data!);
                            } else {
                                result.copyBase(subContainerResult);
                                return result;
                            }
                            break;
                    }
                }
            }
            container = new CalculateContainer(treeconfig.instanceID,newUnit,this._env,this._instanceConfg,subContainers);
        }
        result.data = container;
        return result;
    }

    private _env:any;
    private _treeconfig:TreeConfig;
    private _instanceConfg:InstanceConfig|undefined;
    private _units:Map<string,BaseCalculateUnit<any>>;
}

export class CalculateEngineError {
    public static NoLoadAnyUnits:Error = new Error("no load any units");
    public static LoadUnitFileFaild(filepath:string):Error {
        return new Error(`load ${filepath} faild`);
    }
    public static UnitNotFound(unitID:string):Error {
        return new Error(`UnitID ${unitID} not found`);
    }
    public static UnitInstanceInLoop(instanceID:string):Error{
        return new Error(`Unit Instance ${instanceID} is in loop`);
    }
}