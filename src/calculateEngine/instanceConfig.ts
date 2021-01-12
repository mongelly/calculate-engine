export type InstanceConfig = {
    instanceID:string;
    configs:InstanceUnitConfig[];
}

export type InstanceUnitConfig = {
    instanceID:string;
    config:any;
}