
import { Request, Response } from "express";
import { logActivity } from "../../../infrastructure/logger/core/logs.ts";

export const userLog = (req:Request , res:Response) =>{
  const logInfo = req.body
  if (!logInfo.mac || !logInfo.threat) {
     res.status(400).json({message: "Missing required fields: 'mac', 'threat'"});
     return
      }
      try{
        logActivity(req.body)
        res.status(200).json({message:"Log recorded successfully"})
      }catch(error){
        console.error("Logging error: ",error)
        res.status(500).json({message:"Internal Server Error"})
        return
      }

}
