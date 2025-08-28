import express from "express";
import { selection , agentStatus} from "./db.ts";

// const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
//  Manually set your Wi-Fi IP here
const localIP = "192.168.244.1";

// Route
app.get("/command", async (req, res) => {
    const data = await selection({columnName:'*',tableName:'AgentServices',condition:''})
    res.json(data)
});

app.post("/admin", async (req, res)=>{
  try {
    const updates = req.body; // Example: { "AgentCam": true, "AgentSnip": false }

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Invalid input format" });
    }

    for (const [agentName, agentStatusValue] of Object.entries(updates)) {
      await agentStatus({agentName,agentStatus: Boolean(agentStatusValue)
});
    }

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Database update error" });
  }
});

// Listen on all interfaces
app.listen(PORT, "0.0.0.0", () => {
    console.log(" Server is running:");
    console.log(`Local access  : http://localhost:${PORT}/`);
    console.log(`Wi-Fi access  : http://${localIP}:${PORT}/`);
});
