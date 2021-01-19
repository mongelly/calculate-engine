export type InstanceConfig = {
    configID:string;
    configs:InstanceUnitConfig[];
}

export type InstanceUnitConfig = {
    instanceID:string;
    config:any;
}