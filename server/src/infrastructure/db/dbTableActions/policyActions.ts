import {client} from "../../../../../db/dbConnectivityFunctions/dbConnection.ts"
import { QueryResult } from "pg";

/**
 * creates a new policy 
 * @param policyId id value of the policy
 * @param policyAction action value of the policy
 * @returns create the policy with id and a name in policy table
 */
async function createPolicy({policyId,policyAction}:{policyId:number,policyAction:string}){
    (await client).query(`insert into policy(policy_id,policy_name)values($1,$2)`,[policyId,policyAction]);
}

/**
 * shows the list of the policies
 * @returns returns list of all policies in policy table
 */
async function showPolicys(){
    const dbResult:QueryResult =await (await client).query(`select policy_name from policy`);
    (await client).release();
    console.log(dbResult.rows.map(row => row.policy_name))
    return dbResult.rows.map(row => row.policy_name)
}

/**
 * deletes the policy record from policy table and other tables where policy exist
 * @param policyName name of the policy 
 * @returns deletion of the policy completely in database
 */

async function deletePolicy({policyName}:{policyName:string}){
    const dbResult:QueryResult = await (await client).query(`select policy_id from policy where policy_name =$1`,[policyName]);
    const policyIdToDelete = dbResult.rows[0].policy_id
    (await client).query(`delete from policy where policy_name = $1 and policy_id `,[policyName]);
    const roleRes:QueryResult = await (await client).query(`select role_id,policy_ids from role`);
    for (const row of roleRes.rows){
    const currentIds = row.policy_ids?.split(',').map((id:string) =>parseInt(id.trim())).filter((id:number) => !isNaN(id))
    const updatedRoleIds = currentIds?.filter((id:number) => id !== policyIdToDelete);
     if (updatedRoleIds && updatedRoleIds.length !== currentIds.length) {
        (await client).query(
          `UPDATE usergroup SET policy_ids = $1 WHERE role_id = $2 and role_id>550`,
          [updatedRoleIds.join(','), row.role_id]
        );
      }
    }
    (await client).release();
}

async function registerPolicies(){
  await createPolicy({policyId:1,policyAction:'camera access'})
  await createPolicy({policyId:2,policyAction:'screenshot access'})
  await createPolicy({policyId:3,policyAction:'storage access'})
  await createPolicy({policyId:4,policyAction:'input device access'})
  await createPolicy({policyId:5,policyAction:'portable device access'})
  await createPolicy({policyId:6,policyAction:'Asset Block'})
  await createPolicy({policyId:7,policyAction:'SAP print'})
  await createPolicy({policyId:8,policyAction:'SAP Download'})
  await createPolicy({policyId:9,policyAction:'SAP Watermark'})
  await createPolicy({policyId:10,policyAction:'SAP Command'})
  await createPolicy({policyId:11,policyAction:'SAP ScreenShare'})
  
  // await createPolicy({policyId:9,policyAction:'SAP Clipboard'})trunc
}
