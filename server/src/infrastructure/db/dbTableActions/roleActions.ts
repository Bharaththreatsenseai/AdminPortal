import { client } from "../../../../../db/dbConnectivityFunctions/dbConnection.ts"
import { QueryResult } from "pg"


/**
 * validate if the role exist the role table or not
 * @param roleName name of the role that need to checked 
 * @returns true if role exist or returns false
 */
async function roleExist({roleName}:{roleName:string}){
    const result:QueryResult =await (await client).query(`select role_id from role where role_name = '${roleName}'`)
    if(result.rows.length === 0){
        return false
    }
    else
        return result.rows[0]
}


/**
 * creates a new role in role table 
 * @param roleName name of the role that need to be entered
 * @param roleId id of the role
 * @returns new record is created in role table
 */
async function createRole({roleName,roleId}:{roleName:string,roleId:number}){
    if(!await roleExist({roleName})){
        (await client).query(`insert into role(role_name,role_id)values($1,$2)`,[roleName,roleId])
    }
    else{
        const str = 'role exist'
        return str
    }
    (await client).release()
}

/**
 * update policies to a role 
 * @param roleId role id to which the policies that are needed to assigned 
 * @param policyIds policy ids that are need to assigned must enter group of ids in a string like "1,2,3"
 */
async function updateRolePolicy({roleId,policyIds}:{roleId:number,policyIds:string}){
    (await client).query(`update role set policy_ids = $1 where role_id = $2 and role_id > 550`,[policyIds,roleId]);
    (await client).release()
}

/**
 * shows the roles that are assigned to a group
 * @param groupName name of the group in which the roles are needed to known
 * @returns list of role names from the give group name 
 */
export async function showGroupRoles({groupName}:{groupName:string}){
    const groupResult:QueryResult =await (await client).query(`select role_ids from usergroup where user_group_name = $1`,[groupName]);
    if (groupResult.rowCount === 0) {
      return []; // Group not found
    }
    const roleIds = groupResult.rows[0].role_ids?.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
    if (!roleIds || roleIds.length === 0) {
      return []; // No roles assigned
    }
    const roleResult =await (await client).query(`SELECT role_name FROM role WHERE role_id = ANY($1::int[])`,[roleIds]);
    return roleResult.rows.map((row) => row.role_name);
}

export async function showAllRoles(){
    const roleResult:QueryResult = await (await client).query(`select role_name from role`);
    return roleResult.rows.map((row) => row.role_name);
}

/**
 * fetch the role id from the role name
 * @param roleName name of the role that which id is needed 
 * @returns the role id of the role 
 */
export async function getRoleId({roleName}:{roleName:string}){
    const dbResult:QueryResult=await (await client).query(`select role_id from role where role_name=$1`,[roleName]);
    return dbResult.rows[0]
}

/**
 * @param roleNames array of roleNames that needed to change as string of role ids
 * @returns string of roleids
 */
export async function getRoleIdsString({roleNames}:{roleNames:string[]}) {
  const roleIds = [];

  for (const roleName of roleNames) {
    const result = await getRoleId({ roleName: roleName});
    if (result && result.role_id) {
      roleIds.push(result.role_id);
    }
  }

  return roleIds.join(",");
}

/**
 * shows policy ids of an role
 * @param roleId Id of the existing role
 * @returns policy ids that assigned to the role id in a list
 */
export async function getRolePolicyIds({ roleId }: { roleId: number }): Promise<number[]> {
  const dbResult: QueryResult = await (await client).query(`SELECT policy_ids FROM role WHERE role_id = $1`,[roleId]);
  const policyIds = dbResult.rows[0].policy_ids?.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));

  return policyIds;
}

/**
 * deletes the policy record from policy table and other tables where policy exist
 * @param roleName name of the policy 
 * @returns deletion of the policy completely in database
 */

async function deleteRole({roleName}:{roleName:string}){
    const dbResult:QueryResult = await (await client).query(`select role_id from role where role_name =$1`,[roleName]);
    const roleIdToDelete = dbResult.rows[0].role_id
    (await client).query(`delete from role where role_name = $1 and role_id > 550`,[roleName]);
    const groupRes:QueryResult = await await (await client).query(`select user_group_id,role_ids from usergroup`);
    for (const row of groupRes.rows){
    const currentIds = row.role_ids?.split(',').map((id:string) =>parseInt(id.trim())).filter((id:number) => !isNaN(id))
    const updatedRoleIds = currentIds?.filter((id:number) => id !== roleIdToDelete);
     if (updatedRoleIds && updatedRoleIds.length !== currentIds.length) {
        (await client).query(
          `UPDATE usergroup SET role_ids = $1 WHERE user_group_id = $2 and user_group_id>1100`,
          [updatedRoleIds.join(','), row.user_group_id]
        );
      }
    }
    (await client).release();
}


// fixed roles are defined here
//

/**
 * @returns creates all fixed role "Camera" in database table "role"
 */
async function fixedRoleCam(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 501,'camera',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%camera%'`);
}

/**
 * @returns creates all fixed role "screenshot" in database table "role"
 */
async function fixedRoleScreenshot(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 502,'screenshot',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%screenshot%'`);
}

/**
 * @returns creates all fixed role "storage" in database table "role"
 */
async function fixedRoleStorage(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 503,'Storage',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%storage%'`);
}

async function fixedRoleInput(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 504,'Input device',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%input device%'`);
}

async function fixedRolePortable(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 505,'Portable device',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%portable%'`);
}

async function fixedRoleAsset(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 506,'Asset Block',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%asset block%'`);
}

async function fixedRoleSAPPrint(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 507,'SAP Print',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%Print%'`);
}

async function fixedRoleSAPDownload(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 508,'SAP Download',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%download%'`);
}

async function fixedRoleSAPWatermark(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 509,'SAP Watermark',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%watermark%'`);
}

async function fixedRoleSAPCommand(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 510,'SAP Commands',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%command%'`);
}

async function fixedRoleSAPScreenShare(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 511,'SAP ScreenShare',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%screenshare%'`);
}

/**
 * @returns creates all fixed role "mail"  in database table "role"
 */
async function fixedRoleMail(){
    (await client).query(`insert into role(role_id,role_name,policy_ids) select 504,'mail',string_agg(policy_id::TEXT,',') from policy where policy_name ILIKE '%mail%'`);
}

/**
 * @returns creates all fixed roles in database table "role"
 */
async function fixedRoles(){
    await fixedRoleCam()
    await fixedRoleStorage()
    await fixedRoleScreenshot();
    await fixedRoleInput();
    await fixedRolePortable();
    await fixedRoleAsset();
    await fixedRoleSAPPrint();
    await fixedRoleSAPDownload();
    await fixedRoleSAPWatermark();
    await fixedRoleSAPCommand();
    await fixedRoleSAPScreenShare();
    (await client).release()
}

