import {client,postgresPool} from "../../../../../db/dbConnectivityFunctions/dbConnection.ts"
import {QueryResult} from "pg";
import { getGroupName } from "./userGroupActions.ts";
import { getRoleId,showGroupRoles } from "./roleActions.ts";

/**
 * validate if a user exist in database 
 * @param uid user id of the user that need to be validated
 * @returns true if user exist and false if user not exist
 */
export async function userIdCheck({uid}:{uid:string}){
    const idValue:QueryResult = await postgresPool.query(`SELECT LOWER(user_id) from userTable WHERE user_id ILIKE $1`,[uid])
    if(idValue.rows.length === 0){
        return false
    }else if(uid.toLowerCase() === idValue.rows[0].user_id) {
        return true
    }   
    else{
        return true 
        
    }
}

/**
 * creates a new user (endpoint) in the usertable in database
 * @param userId new id that need to assgined to the user 
 * @param groupId group id in which user is need to be assigned (like "developer or manager or else..") 
 * @returns 
 */
async function createUser({userId,groupId}:{userId:string,groupId:number}){
    if(!await userIdCheck({uid:userId})){
    (await client).query(`insert into userTable(user_id,user_group_id)values($1,$2)`,[userId,groupId]);
    (await client).release();
    }
    else{
        (await client).release();
        return 'user exist'
    }
}
async function removeUser({userId}:{userId:string}){
    if(await userIdCheck({uid:userId})){
        (await client).query(`delete from userTable where user_id = $1`,[userId]);
        (await client).release();
    }
}

async function getUserinfo({userId}:{userId:string}){

}

export async function getUserCount(){
    const idValue:QueryResult = await (await client).query(`select count(*) from userTable`);
    return idValue.rows[0].count
}

export async function getActiveUser(){
    const idValue:QueryResult = await (await client).query(`select count(*) from userTable where deploy_stat ILIKE 'active'`);
    return idValue.rows[0].count
}

export async function getInactiveUser(){
    const idValue:QueryResult = await (await client).query(`select count(*) from userTable where deploy_stat ILIKE 'inactive'`);
    return idValue.rows[0].count
}

// for end point 

/**
 * gets the polices of the user (endpoint) 
 * @param userId user id of the endpoint
 * @returns list of policies that are assigned to the endpoint 
 */

export async function sendData({userId}:{userId:string}){
    // Get user_group_id for the user
    const userRes = await (await client).query(`SELECT user_group_id FROM usertable WHERE user_id ILIKE $1`,[userId]);
    if (userRes.rowCount === 0) return [];

    const groupId = userRes.rows[0].user_group_id;

    // Get group name
    const group = await getGroupName({ groupId });
    if (!group || !group.user_group_name) return [];

    //Get role names assigned to the group
    const roleNames = await showGroupRoles({ groupName: group.user_group_name });
    if (!roleNames || roleNames.length === 0) return [];

    // Get role IDs for each role name
    const roleIdsPromises = roleNames.map(roleName => getRoleId({ roleName }));
    const roleIdsResults = await Promise.all(roleIdsPromises);
    const roleIds: number[] = roleIdsResults.map(r => (r ? r.role_id : null)).filter((id): id is number => id !== null);

    if (roleIds.length === 0) return [];

    //  Get all policy IDs from those role IDs
    const policyIdsSet = new Set<number>();

    for (const roleId of roleIds) {
      const policyIds = await (async () => {
        const dbResult = await (await client).query(`SELECT policy_ids FROM role WHERE role_id = $1`,[roleId]);
        if (dbResult.rowCount === 0) return [];
        return dbResult.rows[0].policy_ids?.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id)) || [];
    })();

      policyIds.forEach((id:number) => policyIdsSet.add(id));
    }

    if (policyIdsSet.size === 0) return [];

    // Step 6: Get policy names for all policy IDs
    const uniquePolicyIds = Array.from(policyIdsSet);

    const policyRes = await (await client).query(`SELECT policy_name FROM policy WHERE policy_id = ANY($1::int[])`,[uniquePolicyIds]);

    return policyRes.rows.map(row => row.policy_name);
}

// createUser({userId:'DESKTOP-M0ST79T',groupId:1001})
// sendData({userId:'Tsense001'})

// userIdCheck({uid:'DESKTOP-M0ST79T'})

