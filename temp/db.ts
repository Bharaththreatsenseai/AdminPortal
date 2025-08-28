import { postgresPool } from "./loginFunctions.ts";
import { QueryResult } from "pg";


export async function agentStatus({agentName,agentStatus}:{agentName:string,agentStatus:boolean}){
    const client = await postgresPool.connect();
    await client.query(`UPDATE AGENTSERVICES SET agentstatus = '${agentStatus}' WHERE agentname = '${agentName}'`)
    await client.release()
}

export async function selection({columnName,tableName,condition}:{columnName:string,tableName:string,condition:string}){
    const dbresult:QueryResult= await postgresPool.query("SELECT "+columnName+" from "+tableName+" "+condition);
    const result: Record<string, any> = {};
    dbresult.rows.forEach(row => {
      const key = row.agentname.trim(); // remove padding
      result[key] = row.agentstatus;
    });
    return result
}

