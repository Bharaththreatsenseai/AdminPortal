import { Request,Response } from "express";
import { showGroupRoles,showAllRoles } from "../../../infrastructure/db/dbTableActions/roleActions.ts";

export const groupRolesInfo = async (req:Request , res:Response) =>{
    const  group = req.body;
    const roles = await  showGroupRoles({groupName: group.groupName})
    const allRoles = await showAllRoles()
    res.json({roles,allRoles}); 
    return;
}