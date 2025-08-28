import {Request,Response} from 'express';
import { sendData } from "../../../infrastructure/db/dbTableActions/userActions.ts";

export const endPoint = async (req:Request, res:Response ) => {
  const userId = req.query.user as string;  // Extract userId from the query
  console.log("Received userId:", userId);
  // Check if userId is provided
  if (!userId) {
    res.status(400).json({ error: "Missing user parameter" }); // 400 if no user is provided
    return;
  }

  try {
    // Get policies for the user
    const userPolicies = await sendData({ userId });

    console.log("User Policies:", userPolicies); // Debug line to see the policies

    // If no policies are assigned, return all policies set to `true`
    if (userPolicies.length === 0) {
      res.json({
        AgentCam: true,
        AgentSnip: true,
        AgentStorage: true,
        AgentPortable: true,
        AgentInput: true,
        AgentAsset: true,
        SAPAgentPrint: true,
        SAPAgentDownload: true,
        SAPAgentWatermark: true,
        SAPAgentCommand: true,
        SAPAgentScreenShare:true
      });
      return;
    }

    // Default policies and mapping
    const defaultPolicies = {
      AgentCam: false,
      AgentSnip: false,
      AgentStorage: false,
      AgentInput: false,
      AgentPortable: false,
      AgentAsset: false,
      SAPAgentPrint: false,
      SAPAgentDownload: false,
      SAPAgentWatermark: false,
      SAPAgentCommand: false,
      SAPAgentScreenShare: false
    };

    const policyMap: Record<string, keyof typeof defaultPolicies> = {
      "camera access": "AgentCam",
      "screenshot access": "AgentSnip",
      "storage access": "AgentStorage",
      "input device access": "AgentInput",
      "portable device access":"AgentPortable",
      "Asset Block":"AgentAsset",
      "SAP print":"SAPAgentPrint",
      "SAP Download":"SAPAgentDownload",
      "SAP Watermark":"SAPAgentWatermark",
      "SAP Command":"SAPAgentCommand",
      "SAP ScreenShare":"SAPAgentScreenShare"
    };

    const updatedPolicies: typeof defaultPolicies = {} as any;

    // Apply inverted logic to set the policies
    for (const [policyName, key] of Object.entries(policyMap)) {
      const hasPolicy = userPolicies.includes(policyName);
      updatedPolicies[key] = hasPolicy ? false : true; // true if user does not have access, false if they do
      console.log(`Policy: ${policyName}, Has Policy: ${hasPolicy}, Updated: ${updatedPolicies[key]}`); // Debug line
    }

    res.json(updatedPolicies); // Send the updated policies as a JSON response
    return;

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error, please try again later" });
    return;
  }
}