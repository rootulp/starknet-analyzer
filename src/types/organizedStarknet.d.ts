import { BigNumber } from "ethers";
import { FunctionAbi, AbiEntry } from "starknet/types/index";
import { EventAbi } from "./rawStarknet";

export interface ContractInfos {
     [key: string]: { 
         transactionCount: number, 
         type: string 
        } 
}

export interface AccountCallArray {
    to: BigNumber,
    selector: BigNumber,
    dataOffset: BigNumber,
    dataLen: BigNumber
}

export interface StarknetContractCode {
    functions: OrganizedFunctionAbi,
    structs: OrganizedStructAbi,
    events: OrganizedEventAbi
}

export interface OrganizedFunctionAbi { 
    [selector: string]: FunctionAbi 
}

export interface OrganizedStructAbi {
    [key: string]: StarknetStruct
}

export interface OrganizedEventAbi { 
    [key: string]: EventAbi
}

export interface StarknetStruct { 
    size: number,
    properties: (AbiEntry & { offset: number; })[] | []
}

export type StarknetArgument = { [key: string]: any } | BigNumber;

export interface CallArray {
    to: BigNumber,
    selector: BigNumber,
    dataOffset: BigNumber,
    dataLen: BigNumber
}

export interface FunctionCall {
    name: string;
    to: BigNumber;
    calldata: any;
}

export type OrganizedCalldata = StarknetArgument | StarknetArgument[];

export interface OrganizedEvent { 
    name: string, 
    transmitterContract: string, 
    calldata: {
        [key: string]: any;
    } 
}

export interface OrganizedTransaction {
    hash: string,
    events: OrganizedEvent[],
    origin: string,
    entrypointSelector: string,
    entrypointType?: string,
    functionCalls?: OrganizedCalldata,
    maxFee?: string,
    type: string
}