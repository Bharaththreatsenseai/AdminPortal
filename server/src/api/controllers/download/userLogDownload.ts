import fs from "fs";
import path from "path";
import os from "os";
import {Request,Response} from 'express'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to sanitize filename
function safeFileName(name: string) {
  return name.replace(/:/g, "_").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
}

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

export const userLogDownload= (req:Request, res:Response) => {
  const userMac = req.body.mac || "unknown";
  const sanitizedMac = safeFileName(userMac);

  const userLogPath = path.join(__dirname, "..", "..", "..","infrastructure","logger", "logs", "userlogs", `${sanitizedMac}.log`);

  if (!fs.existsSync(userLogPath)) {
    res.status(404).send("Log file not found");
  }

  const rawLogData = fs.readFileSync(userLogPath, "utf-8");
  const logLines = rawLogData.trim().split("\n");
  const friendlyLog = formatLogsForDownload(logLines);

  // Create a temp file path
  const tempFilePath = path.join(os.tmpdir(), `${sanitizedMac}_friendly.log`);

  // Write formatted logs to temp file
  fs.writeFileSync(tempFilePath, friendlyLog, "utf-8");

  // Send file and then delete it
  res.download(tempFilePath, `${sanitizedMac}_friendly.log`, (err) => {
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
