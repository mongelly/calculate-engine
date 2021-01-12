import * as Path from 'path';
import CalculateLoader from '../calculateEngine/calculateLoader';
import assert from 'assert';
import fs from 'fs';

describe('loader test',() => {
    it('loader test', async () => {
        let resource:Array<string|any> = new Array();
        resource = [Path.join(__dirname,"../builtinUnits")];
        let loadResult = await CalculateLoader.loadUnits(resource);
        if(loadResult.succeed){
            let files = fs.readdirSync(Path.join(__dirname,"../builtinUnits"));
            let regex = "(.unit.js|.unit.ts)$";
            let unitFiles = files.filter(filename => (new RegExp(regex).test(filename)));
            assert.strictEqual((loadResult.data != undefined && loadResult.data?.size == unitFiles.length),true);
        } else {
            assert.fail("load faild");
        }
    })
});