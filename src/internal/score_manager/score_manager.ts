import { ItemResponse } from "aws-sdk/clients/dynamodb";
import { HerrorStatus } from "../../pkg/herror/status_codes";
import { IKVStore } from "../../pkg/kv_store/kv_store";
import { MatchSetupDetails, ScoreCard, ScoreCardCommentry, ScoreItem } from "../entities/scoreitem";
import { Channel, Connection } from "amqplib";

interface IResponse {
    statusCode: number;
    message?: string;
  }

export default class ScoreManager{
    private mq: Connection;
    private dynamoDB: AWS.DynamoDB.DocumentClient
    constructor(
        mq:Connection,
        dynamo:AWS.DynamoDB.DocumentClient
    ){
        this.mq = mq;
        this.dynamoDB = dynamo;
    }
    
    async PushToQueue(ScoreDetails: ScoreItem):Promise<{responseStatus:IResponse}>{
       return new Promise(async (resolve,reject)=>{
            try{
                // Create a channel
              const channel: Channel = await this.mq.createChannel()
              
              // Makes the queue available to the client
              await channel.assertQueue('myQueue')
              channel.sendToQueue('myQueue', Buffer.from(JSON.stringify(ScoreDetails)))
                resolve(
                    {
                        responseStatus: {
                            statusCode: HerrorStatus.StatusOK,
                            message: "ball_added",
                          },
                    }
                )
            }
            catch(err){
                reject(err)
            }
        })
    }

    async GetExistingMatchCount():Promise<number>{
      return new Promise((resolve,reject)=>{
        try{
          const params1 = {
            TableName: 'IMatches',
        }
        let count:number | undefined = 0;
        this.dynamoDB.scan(params1,(err,data)=>{
            if (err) {
                console.log("Error", err);
              } else {
                count  = data.Count
                console.log(data)
              }
        })
        resolve(count)
        }
        catch(err){
         reject(err)
        }
      })
    }

    async CreateMatch(PrimaryInfo: MatchSetupDetails):Promise<{responseStatus:IResponse}>{
        return new Promise(async (resolve,reject)=>{
            try{
               let count:number  = await this.GetExistingMatchCount()+1;
               count = count+1;
               const params1 = {
                TransactItems:[{
                 Put:{
                  TableName: 'IMatches',
                  Item: {
                    match_id: 'match_'+count,
                    data_type:'match_'+count+'_raw',
                    Score:[
                      PrimaryInfo
                    ]
                  }}
                },
                {
                  Put:{
                    TableName: 'IMatches',
                    Item: {
                      match_id: 'match_'+count,
                      data_type:'match_'+count+'_commentry',
                    }
                  }
                },
                {
                  Put:{
                    TableName: 'IMatches',
                    Item: {
                    match_id: 'match_'+count,
                    data_type:'match_'+count+'_scorecard_A',
                  }
                  }
                },
                {
                  Put:{
                    TableName: 'IMatches',
                    Item: {
                    match_id: 'match_'+count,
                    data_type:'match_'+count+'_scorecard_B',
                  }
                  }
                },
                {
                  Put:{
                    TableName: 'IMatches',
                    Item: {
                    match_id: 'match_'+count,
                    data_type:'match_'+count+'_summary',
                  }
                  }
                }
              ]
             }
            this.dynamoDB.transactWrite(params1, function(err, data) {
              if (err) {
                console.log("Error", err);
              } else {
                console.log("Success", data);
              }
            });
          resolve({
              responseStatus: {
                  statusCode: HerrorStatus.StatusCreated,
                  message: "match_created",
                },
          })
            }
            catch(err){
                reject(err)
            }
        })
    }

    async GetSummary(match_id:string){
        return (
            new Promise((resolve,reject)=>{
                let summary:ScoreCardCommentry
                try{ 
                   const params1 = {
                    TableName: 'ScoreDetails',
                    Key:{
                        match_id:match_id,
                        data_type:match_id+"_summary"
                    }
                   }
                   this.dynamoDB.get(params1,(err,data)=>{
                    if (err) {
                        console.log("Error", err);
                      } else {
                        console.log("Success", data);
                        // TODO: store data in summary.
                      }
                      resolve({
                        data:summary,
                        responseStatus:{
                            statusCode: HerrorStatus.StatusOK,
                            message: "summary_retrieved",
                        }
                      })
                   });
                }
                catch(err){
                    reject(err)
                }
            })
        )
    }

    async GetScoreCard(match_id:string, team_type:'A'|'B'){
        return (
            new Promise((resolve,reject)=>{
                   try{ 
                       let score_card:ScoreCard
                       const params1 = {
                        TableName: 'ScoreDetails',
                        Key:{
                            match_id:match_id,
                            data_type:match_id+"_scorecard_"+team_type
                        }
                      }
                       this.dynamoDB.get(params1,(err,data)=>{
                        if (err) {
                            console.log("Error", err);
                          } else {
                            console.log("Success", data);
                            // TODO: store data in summary.
                          }
                          resolve({
                            data:score_card,
                            responseStatus:{
                                statusCode: HerrorStatus.StatusOK,
                                message: "scorecard_retrieved",
                            }
                          })
                       });
                }
                catch(err){
                    reject(err);
                }
            })
        );
    }
}

