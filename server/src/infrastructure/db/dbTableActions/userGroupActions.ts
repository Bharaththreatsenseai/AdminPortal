import {client} from "../../../../../db/dbConnectivityFunctions/dbConnection.ts"
import{ QueryResult} from 'pg'

/**
 * validates if a group exist or not
 * @param groupName name of the group that needed to be validated
 * @returns true if the group exist and false if group not exist
 */
async function groupExist({groupName}:{groupName:string}){
    const result:QueryResult =await (await client).query(`select LOWER(user_group_id) from usergroup where LOWER(user_group_name) = LOWER($1)`,[groupName])
    if(result.rows.length === 0){
        return false
    }
    else
        return true
}

/**
 * 
 * @param groupId new group if of the adding group
 * @param groupName new group name of 
 * @returns 
 */
async function createUserGroup({groupId,groupName}:{groupId:number,groupName:string}){
    if(!await groupExist({groupName:groupName})){
        (await client).query(`insert into usergroup(user_group_id,user_group_name) values($1,$2)`,[groupId,groupName]);
    }else{
        (await client).release()
        return 'Group exist'
    }
    (await client).release();
}

/**
 * update role ids in a group
 * @param groupId id of the group in which roleids needed to updated
 * @param roleIds new roles ids as a string like "501,502,503" 
 */
export async function updateGroupRoles({groupId,roleIds}:{groupId:number,roleIds:string}){
    (await client).query(`update usergroup set role_ids = $1 where user_group_id = $2  `,[roleIds,groupId]);

}

/**
 * shows all the group names  from the usergroup table
 * @returns list of all groupnames in usergroup table
 */
export async function showGroups(){
    const dbresult:QueryResult= await (await client).query(`select user_group_name from usergroup`);
    const groups = dbresult.rows.map(row => row.user_group_name)
    return groups
}

/**
 * deletes a group record from the usergroup table
 * @param groupName name o the group that which need to be delete
 * @returns deletes the group
 */
async function deleteGroup({groupName}:{groupName:string}){
    const dbresult:QueryResult = await (await client).query(`select role_ids from usergroup where user_group_name = $1 `,[groupName]);
    (await client).query(`delete from usergroup where user_group_name = $1 and user_group_id >1100`,[groupName]);
    const roleIds = dbresult.rows[0].role_ids?.split(',').map((id:string)=>parseInt(id.trim())).filter((id:number)=>!isNaN(id));
     if (roleIds && roleIds.length > 0) {
      (await client).query(`delete from role where role_id = ANY($1::int[]) and role_id>550`,[roleIds]);
    }
    (await client).release()
}

/**
 * renames a group
 * @param groupName name of the group that which is needed to be renamed
 * @param newName  new name that need to assigned 
 */
async function editGroupName({groupName,newName}:{groupName:string,newName:string}){
    (await client).query(`update usergroup set user_group_name = $1 where user_group_name = $2 and group_id>1100`,[newName,groupName]);
    (await client).release()
}


export async function getGroupId({groupName}:{groupName:string}){
    const dbResult:QueryResult=await (await client).query(`select user_group_id from usergroup where user_group_name = $1`,[groupName]);
    return dbResult.rows[0].user_group_id
}
/**
 * get group name from the group id
 * @param groupId group id of group that which group name is need to known
 * @returns 
 */
export async function getGroupName({groupId}:{groupId:number}){
    const dbResult:QueryResult=await (await client).query(`select user_group_name from usergroup where user_group_id = $1`,[groupId]);
    return dbResult.rows[0]
}

// fixed groups are defined here

/**
 * @returns creates a fixed record  admin in grouptable
 */
async function fixedGroupAdmin(){
    (await client).query(`insert into usergroup(user_group_id,user_group_name,role_ids) select 1001,'developer',string_agg(role_id::TEXT,',') from role where role_id >500 AND role_id<=504`);
    (await client).release()
}

/**
 * @returns creates a fixed record  manager in grouptable
 */
async function fixedGroupManager(){
    (await client).query(`insert into usergroup(user_group_id,user_group_name,role_ids) select 1001,'manager',string_agg(role_id::TEXT,',') from role where role_id >500 AND role_id<=504`);
    (await client).release()
}


/**
 * @returns creates a fixed record  user in grouptable
 */
async function fixedGroupdeveloper(){
    (await client).query(`insert into usergroup(user_group_id,user_group_name,role_ids) select 1002,'developer',string_agg(role_id::TEXT,',') from role where role_id >500 AND role_id<=504`);
    (await client).release()
}
