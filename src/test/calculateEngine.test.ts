import { BaseCalculateUnit } from "../calculateEngine/baseCalculateUnit";
import * as Path from 'path';
import CalculateLoader from "../calculateEngine/calculateLoader";
import assert from 'assert';
import { TreeConfig } from "../calculateEngine/treeConfig";
import { InstanceConfig } from "../calculateEngine/instanceConfig";
import CalculateEngine from "../calculateEngine/calculateEngine";


describe('builtin-unit test',() => {
        let units:Map<string,BaseCalculateUnit<any>> = new Map();
        let env:any = {};

        before( async () => {
            let resource:Array<string|any> = new Array();
            resource = [Path.join(__dirname,"../builtinUnits")];
            let loadResult = await CalculateLoader.loadUnits(resource);
            if(loadResult.succeed && loadResult.data){
                units = loadResult.data;
            } else {
                assert.fail("load faild");
            }
        });

        describe('builtin-static test', () => {
            it('builtin-static test 1', async () => {
                let treeConfig:TreeConfig = {
                    configID:"21b67095-09f1-4a28-a99a-e47654c6bea7",
                    root:{
                        instanceID:"595156eb-10a5-4844-b161-fac32bb1600f",
                        unitID:"00000000-0000-0000-0001-000000000001",
                        inputs:[{
                            type:'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
        });

        describe('buildtin-and test', () => {
            it('buildtin-and test 1', async () => {
                let treeConfig:TreeConfig = {
                    configID:"b0ba29be-4bca-46df-bdcf-164833614ac8",
                    root:{
                        instanceID:"ba963327-bac4-44ec-a510-1e3071890f0d",
                        unitID:"00000000-0000-0000-0001-3336ad58a20e",
                        inputs:[{
                            type:'value',
                            value:true
                        },
                        {
                            type: 'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
    
            it('buildtin-and test 2', async () => {
                let treeConfig:TreeConfig = {
                    configID:"b0ba29be-4bca-46df-bdcf-164833614ac8",
                    root:{
                        instanceID:"ba963327-bac4-44ec-a510-1e3071890f0d",
                        unitID:"00000000-0000-0000-0001-3336ad58a20e",
                        inputs:[{
                            type:'value',
                            value:false
                        },
                        {
                            type: 'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,false);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
    
            it('buildtin-and test 3', async () => {
                let treeConfig:TreeConfig = {
                    configID:"b0ba29be-4bca-46df-bdcf-164833614ac8",
                    root:{
                        instanceID:"ba963327-bac4-44ec-a510-1e3071890f0d",
                        unitID:"00000000-0000-0000-0001-3336ad58a20e",
                        inputs:[{
                            type:'value',
                            value:false
                        },
                        {
                            type: 'value',
                            value:false
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,false);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });

            it('buildtin-and test 4', async () => {
                let treeConfig:TreeConfig = {
                    configID:"b0ba29be-4bca-46df-bdcf-164833614ac8",
                    root:{
                        instanceID:"ba963327-bac4-44ec-a510-1e3071890f0d",
                        unitID:"00000000-0000-0000-0001-3336ad58a20e",
                        inputs:[{
                            type:'ref',
                            value:"01691075-9a3d-4e08-afa3-ac4c6b31a0bb"
                        },
                        {
                            type:'ref',
                            value:"7da22dd7-e43f-4f65-adc4-eddc6bc46a6e"
                        },
                        {
                            type: 'value',
                            value:true
                        }]
                    },
                    references:[
                        {
                            instanceID:"01691075-9a3d-4e08-afa3-ac4c6b31a0bb",
                            unitID:"00000000-0000-0000-0001-3336ad58a20e",
                            inputs:[{
                                type:'value',
                                value:true
                            },
                            {
                                type: 'value',
                                value:true
                            }]
                        },
                        {
                            instanceID:"7da22dd7-e43f-4f65-adc4-eddc6bc46a6e",
                            unitID:"00000000-0000-0000-0001-3336ad58a20e",
                            inputs:[{
                                type:'value',
                                value:false
                            },
                            {
                                type: 'value',
                                value:true
                            }]
                        }
                    ]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,false);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
        });

        describe('buildtin-normal test', () => {
            it('builtin-normal test 1', async () => {
                let treeConfig:TreeConfig = {
                    configID:"85717ecb-dd30-4851-ae92-08be65306165",
                    root:{
                        instanceID:"33a12e18-2179-4063-a5f3-50e7817921bb",
                        unitID:"00000000-0000-0000-0001-3424e55bf0d5",
                        inputs:[{
                            type:'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });

            it('builtin-normal test 2', async () => {
                let treeConfig:TreeConfig = {
                    configID:"72c81527-7367-4414-b973-70bb5fd583c0",
                    root:{
                        instanceID:"7e1ce892-fc1e-44d0-b4c9-3bc698620c87",
                        unitID:"00000000-0000-0000-0001-3424e55bf0d5",
                        inputs:[{
                            type:'value',
                            value:false
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,false);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
        });

        describe('buildtin-not test', () => {
            it('builtin-normal test 1', async () => {
                let treeConfig:TreeConfig = {
                    configID:"b8fe486a-7734-4a5a-93ee-23e4ac321f6d",
                    root:{
                        instanceID:"eec0a261-8409-4425-ba96-e9ae384b8284",
                        unitID:"00000000-0000-0000-0001-81f8dbd25d7e",
                        inputs:[{
                            type:'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,false);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });

            it('builtin-normal test 2', async () => {
                let treeConfig:TreeConfig = {
                    configID:"25cd8507-85e6-468e-8f1c-94edc343cb65",
                    root:{
                        instanceID:"0020c78d-4110-4ae7-8481-65c9ff9f3b62",
                        unitID:"00000000-0000-0000-0001-81f8dbd25d7e",
                        inputs:[{
                            type:'value',
                            value:false
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
        });

        describe('buildtin-or test', () => {
            it('buildtin-or test 1', async () => {
                let treeConfig:TreeConfig = {
                    configID:"0aed2045-355e-4c47-b7f0-29f7c9936cb2",
                    root:{
                        instanceID:"8bb04683-1f61-45dd-b73c-8c2912a05262",
                        unitID:"00000000-0000-0000-0001-d5802c7b6b41",
                        inputs:[{
                            type:'value',
                            value:true
                        },
                        {
                            type: 'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
    
            it('buildtin-or test 2', async () => {
                let treeConfig:TreeConfig = {
                    configID:"f8a79d6d-6e74-4d33-9da1-56828f8f32af",
                    root:{
                        instanceID:"a87ec407-2a6c-4a74-9341-92002b663af0",
                        unitID:"00000000-0000-0000-0001-d5802c7b6b41",
                        inputs:[{
                            type:'value',
                            value:false
                        },
                        {
                            type: 'value',
                            value:true
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
    
            it('buildtin-or test 3', async () => {
                let treeConfig:TreeConfig = {
                    configID:"0cb38c9b-0e07-4c4b-9959-acc8aead49a3",
                    root:{
                        instanceID:"6b897011-514c-4489-95f7-d56b46923f8a",
                        unitID:"00000000-0000-0000-0001-d5802c7b6b41",
                        inputs:[{
                            type:'value',
                            value:false
                        },
                        {
                            type: 'value',
                            value:false
                        }]
                    },
                    references:[]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,false);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });

            it('buildtin-or test 4', async () => {
                let treeConfig:TreeConfig = {
                    configID:"ddacf1a9-af91-4629-b503-ca33010cdaef",
                    root:{
                        instanceID:"84c06a01-d634-4547-a6dd-071ed2fb9aad",
                        unitID:"00000000-0000-0000-0001-d5802c7b6b41",
                        inputs:[{
                            type:'ref',
                            value:"c85e221f-6ca7-4b01-9363-e10c31167df2"
                        },
                        {
                            type:'ref',
                            value:"6a705fba-df2a-481e-b6f9-73be16b6858d"
                        },
                        {
                            type: 'value',
                            value:true
                        }]
                    },
                    references:[
                        {
                            instanceID:"c85e221f-6ca7-4b01-9363-e10c31167df2",
                            unitID:"00000000-0000-0000-0001-d5802c7b6b41",
                            inputs:[{
                                type:'value',
                                value:true
                            },
                            {
                                type: 'value',
                                value:true
                            }]
                        },
                        {
                            instanceID:"6a705fba-df2a-481e-b6f9-73be16b6858d",
                            unitID:"00000000-0000-0000-0001-d5802c7b6b41",
                            inputs:[{
                                type:'value',
                                value:false
                            },
                            {
                                type: 'value',
                                value:true
                            }]
                        }
                    ]
                };
    
                let buildResult = await CalculateEngine.calculateUnitBuilder(env,treeConfig,undefined,units);
                if(buildResult.succeed && buildResult.data){
                    let container = buildResult.data!
                    let execResult = await container.exec({});
                    if(execResult.succeed && execResult.data != undefined){
                        assert.strictEqual(execResult.data,true);
                    } else {
                        assert.fail("exec faild");
                    }
                } else {
                    assert.fail("build faild");
                }
            });
        });
    });