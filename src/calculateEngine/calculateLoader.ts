import { ActionData } from "../utils/components/actionResult";
import { BaseCalculateUnit } from "./baseCalculateUnit";
import fs from 'fs';
import * as Path from 'path';

export default class CalculateLoader {
    public static async loadUnits(resource:Array<string|any>):Promise<ActionData<Map<string,BaseCalculateUnit<any>>>>{
        let result = new ActionData<Map<string,BaseCalculateUnit<any>>>();
        
        if(resource.length > 0){
            let map = new Map<string,BaseCalculateUnit<any>>();
            for(const item of resource){
                if (typeof(item) == "string"){
                    try {
                        let stat = fs.statSync(item);
                        if(stat.isDirectory()){
                            let loadResult = await this.loadUnitFromDir(item);
                            if(loadResult.succeed){
                                map = new Map([...map,...loadResult.data!]);
                            }
                        } else if(stat.isFile()){
                            let loadResult = await this.loadUnitFromFile(item);
                            if(loadResult.succeed){
                                map.set(loadResult.data!.unitID,loadResult.data!.unit);
                            }
                        }
                    } catch (error) {
                        continue;
                    }
                } else if(item.__proto__ != undefined && item.__proto__.name == BaseCalculateUnit.name){
                    let loadResult = await this.loadUnitFromEntity(item);
                    if(loadResult.succeed){
                        map.set(loadResult.data!.unitID,loadResult.data!.unit);
                    }
                }
            }
            result.data = map;
            result.succeed = true;
        } else {
            result.succeed = false;
            result.error = CalculateLoaderError.NoLoadAnyUnits;
        }

        return result;
    }

    private static async loadUnitFromFile(path:string):Promise<ActionData<{unitID:string,unit:BaseCalculateUnit<any>}>>{
        let result = new ActionData<{unitID:string,unit:BaseCalculateUnit<any>}>();
        if(fs.existsSync(path)){
            const unit = require(path);
            if(unit){
                if(CalculateLoader.classInterfaceOf(unit.default,BaseCalculateUnit)){
                    let instance = (new unit.default) as BaseCalculateUnit<any>;
                    result.data = {unitID:instance.unitID,unit:instance};
                    result.succeed = true;
                } else {
                    result.succeed = false;
                    result.error = CalculateLoaderError.LoadUnitFileFaild(path);
                }
            } else {
                result.succeed = false;
                result.error = CalculateLoaderError.LoadUnitFileFaild(path);
            }
        } else {
            result.succeed = false;
            result.error = CalculateLoaderError.LoadUnitFileFaild(path);
        }
        return result;
    }

    private static async loadUnitFromDir(path:string):Promise<ActionData<Map<string,BaseCalculateUnit<any>>>>{
        let result = new ActionData<Map<string,BaseCalculateUnit<any>>>();
        result.data = new Map<string,BaseCalculateUnit<any>>();
        try {
            let files = fs.readdirSync(path);
            let regex = "(.unit.js|.unit.ts)$";
            let unitFiles = files.filter(filename => (new RegExp(regex).test(filename)));
            for(const unitFile of unitFiles){
                let fileFullPath = Path.join(path,unitFile);
                let loadResult = await this.loadUnitFromFile(fileFullPath);
                if(loadResult.succeed){
                    result.data.set(loadResult.data!.unitID,loadResult.data!.unit);
                } else {
                    result.succeed = false;
                    result.error = CalculateLoaderError.LoadUnitFileFaild(unitFile);
                    result.data = undefined;
                    return result;
                }
                result.succeed = true;
            }
        } catch (error) {
            result.succeed = false;
            result.error = CalculateLoaderError.LoadUnitFileFaild(path);
        }

        return result;
    }

    private static async loadUnitFromEntity(entity:any):Promise<ActionData<{unitID:string,unit:BaseCalculateUnit<any>}>>{
        let result = new ActionData<{unitID:string,unit:BaseCalculateUnit<any>}>();
        if(entity.__proto__ != undefined && entity.__proto__.name == BaseCalculateUnit.name){
            let instance = (new entity) as BaseCalculateUnit<any>;
            result.data = {unitID:instance.unitID,unit:instance};
            result.succeed = true;
        } else {
            result.succeed = false;
            result.error = CalculateLoaderError.LoadUnitFileFaild(entity.name || "");
        }
        return result;
    }

    private static classInterfaceOf(object:any,baseclass:any):boolean {
        if(object.__proto__ != undefined && object.__proto__.name != undefined && baseclass.name != undefined){
            if(object.__proto__.name === baseclass.name){
                return true
            } else {
                return CalculateLoader.classInterfaceOf(object.__proto__,baseclass);
            }
        } else {
            return false;
        }
    }
}

export class CalculateLoaderError {
    public static NoLoadAnyUnits:Error = new Error("no load any units");
    public static LoadUnitFileFaild(filepath:string):Error {
        return new Error(`load ${filepath} faild`);
    }
}