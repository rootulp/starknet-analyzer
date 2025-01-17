import { 
    Provider, 
    InvokeFunctionTransaction
} from "starknet";

import { 
    Event,
    GetBlockResponse,
    TransactionReceipt
} from "../types/rawStarknet";
import {
    OrganizedEvent,
    FunctionCall,
    OrganizedTransaction
} from "../types/organizedStarknet";
import { TransactionCallAnalyzer } from "./TransactionCallAnalyzer";
import { ContractCallAnalyzer } from "./ContractCallAnalyzer";
import { sleep } from "../helpers/helpers";

export class BlockAnalyzer extends TransactionCallAnalyzer {

    constructor(provider: Provider) {
        super(provider);
    }

    async organizeTransactions(block: GetBlockResponse) {
        const transactions = block.transactions;
        const receipts = block.transaction_receipts as TransactionReceipt[];

        let organizedTransactions: OrganizedTransaction[] = [];
        for(const receipt of receipts) {
            const tx = transactions[receipt.transaction_index] as InvokeFunctionTransaction;
            let events: OrganizedEvent[] = [];
            let functionCalls: FunctionCall[] | undefined;
            for(const event of receipt.events) {
                // const eventCalldata = await this.getEventOutput(event);
                const contractCallAnalyzer = await new ContractCallAnalyzer(event.from_address).initialize(this.provider);
                try {
                    const eventCalldata = contractCallAnalyzer.organizeEvent(event);
                    if(eventCalldata) {
                        events.push(eventCalldata);
                    }
                } catch(error) {}

                functionCalls = await this.getCalldataPerCallFromTx(tx);
                await sleep(2000);
            }
            organizedTransactions.push({
                hash: receipt.transaction_hash,
                events,
                functionCalls,
                origin: tx.contract_address,
                entrypointSelector: tx.entry_point_selector,
                type: tx.type
            });
        }

        return organizedTransactions;
    
    }
}