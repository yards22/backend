import { IKVStore } from "../../pkg/kv_store/kv_store";

export default class ScoreManager{
    private queue: IKVStore;
    private dynamo: AWS.DynamoDB
    constructor(
        queue:IKVStore,
        dynamo:AWS.DynamoDB
    ){
        this.queue = queue;
        this.dynamo = dynamo;
    }
    
    async PushToQueue(ScoreDetails: string,match_id:string){
       return new Promise((resolve,reject)=>{
            try{
                this.queue.LPush(match_id,ScoreDetails)
                resolve(1)
            }
            catch(err){
                reject(err)
            }
        })
    }
}

