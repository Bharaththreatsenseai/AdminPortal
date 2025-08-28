import { getUserCount,getActiveUser,getInactiveUser } from "../../../../infrastructure/db/dbTableActions/userActions.ts";
import { Request,Response } from "express";
export const userCount = async(req:Request,res:Response)=>{
    try{const totalCount = await getUserCount()
    const activeUser = await getActiveUser()
    const inactiveUser = await getInactiveUser()
    const data = {
        "Total users":totalCount,
        "Active Users":activeUser,
        "Inactive Users":inactiveUser
    }
    res.json(data)
}
    catch(exception){
        console.log(exception)
    }

    return
}