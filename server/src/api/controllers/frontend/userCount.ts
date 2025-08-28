import { getUserCount,getActiveUser,getInactiveUser } from "../../../infrastructure/db/dbTableActions/userActions.ts";
import { Request,Response } from "express";
export const userCount = async(req:Request,res:Response)=>{

    const totalCount = await getUserCount()
    const activeCount = await getActiveUser()
    const InactiveCount = await getInactiveUser()
    const data  = {
        "Total endpoints":totalCount,
        "Active endpoints":activeCount,
        "Inactive endpoints":InactiveCount
    }
    console.log(res.send(data))
}
