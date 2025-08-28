import { Request,  Response } from "express";
import { getRoleIdsString } from "../../../infrastructure/db/dbTableActions/roleActions.ts";
import { updateGroupRoles ,getGroupId} from "../../../infrastructure/db/dbTableActions/userGroupActions.ts";


export const saveChanges  =  async  (req:Request, res:Response) =>{
  try {
    const { groupName, roles } = req.body;
    console.log("Received body:", req.body);

    if (typeof groupName !== "string" || !Array.isArray(roles)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const groupId =await  getGroupId({groupName:groupName})
    const ids = await getRoleIdsString({roleNames:roles})
    await updateGroupRoles({groupId:groupId,roleIds:ids})
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating roles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}


