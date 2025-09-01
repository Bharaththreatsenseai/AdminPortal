import { showGroups } from "../../../infrastructure/db/dbTableActions/userGroupActions.ts"
import {Request,Response} from 'express';
export const userGroupInfo = async (req:Request , res:Response) =>{
    const groups  = await  showGroups()
    res.json({"groups":groups}); 
}