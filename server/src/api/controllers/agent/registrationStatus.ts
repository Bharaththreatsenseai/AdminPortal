import { Request, Response } from "express";
import { client } from "../../../../../db/dbConnectivityFunctions/dbConnection.ts";

export const registrationStatus = async (req:Request , res:Response) =>{
    const  {registration , mac }= req.body;
    if(registration == "success")
        (await client).query(`update userTable set deploy_stat = 'active' where mac = $1`,[mac])
        return
    }  
   
