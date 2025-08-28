import {client} from "../dbConnectivityFunctions/dbConnection.ts"

export async function adminTable(){  

}
//creates a "usertable" table
export async function userTable(){
    (await client).query(`create table usertable(user_id varchar(30) primary key ,user_group_id int ,foreign key(user_group_id) references usergroup(user_group_id) on delete cascade)`)
}

//creates a "usergroup" table
export async function userGroupTable(){
    (await client).query(`create table usergroup(user_group_id int primary key,user_group_name varchar(30),role_ids varchar(60))`);
}

//creates a "role" table
export async function roleTable(){
    (await client).query(`Create table role(role_id int primary key,role_name varchar(30),policy_ids varchar(30))`);
}



export async function policyTable(){
    (await client).query(`Create table policy(policy_id int primary key,policy_name varchar(20) unique)`);
}


