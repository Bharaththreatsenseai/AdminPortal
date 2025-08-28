import fs from "fs";
import path, { toNamespacedPath } from "path";
import os from "os";
import {Request,Response} from 'express'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function formatLogsForDownload(logLines: string[]) {
  const header = "    Username    |     User MAC      |    Threat   |  Remedy |       Tool       |        Time       |  \n----------------------------------------------------------------------------------------------------\n";
  const formattedLines = logLines.map(line => {
    try {
      // Remove the [LEVEL] prefix using regex or split
      const jsonPart = line.replace(/^\[[A-Z]+\]\s*/, ""); 
      const log = JSON.parse(jsonPart);
      return `${log.username || "-"} | ${log.mac || "-"} | ${log.threat || "-"} | ${log.remedy || "-"} | ${log.tool || "-"} | ${log.time || "-"} `;
    } catch {
      return line; // fallback to raw line if parsing fails
    }
  });
  return header + formattedLines.join("\n");
}

export const allLogsDownload= (req:Request, res:Response) => {
  const allLogs = req.body.download 
    if(!allLogs){
        return
    }
  const activityLogPath = path.join(__dirname, "..", "..", "..","infrastructure","logger", "logs", "alllogs", `activity.log`);

  if (!fs.existsSync(activityLogPath)) {
    res.status(404).send("Log file not found");
  }

  const rawLogData = fs.readFileSync(activityLogPath, "utf-8");
  const logLines = rawLogData.trim().split("\n");
  const friendlyLog = formatLogsForDownload(logLines);

  const name = "activity"
  // Create a temp file path
  const tempFilePath = path.join(os.tmpdir(), `${name}_download.log`);

  // Write formatted logs to temp file
  fs.writeFileSync(tempFilePath, friendlyLog, "utf-8");

  // Send file and then delete it
  res.download(tempFilePath, `${name}_download.log`, (err) => {
    // Delete temp file after sending (or if error occurs)
    fs.unlink(tempFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting temp log file:", unlinkErr);
      }
    });

    if (err) {
      console.error("Error during log download:", err);
      // You can also send an error response here if needed
    }
  });
};
