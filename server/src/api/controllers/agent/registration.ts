import { Request, Response } from "express";
import { client } from "../../../../../db/dbConnectivityFunctions/dbConnection.ts";

export const userRegistration = async (req:Request , res:Response) =>{
    const  {user , mac , os , email}= req.body;
    console.log(req.body)
    if(email.includes("@threatsenseai.com") ){
        (await client).query(`insert into userTable(user_id,mac,os) values($1,$2,$3)`,[user,mac,os])
        res.send('OK');
        
    }  
    else {
        res.send('CANCEL')
    }
}