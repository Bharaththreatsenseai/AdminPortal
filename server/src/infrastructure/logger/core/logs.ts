import path from "path";
import fs from "fs";
import winston from "winston";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log directories
const allLogsDir = path.join(__dirname, "..", "logs", "allLogs");
const userLogsDir = path.join(__dirname, "..", "logs", "userlogs");

// Ensure directories exist
fs.mkdirSync(allLogsDir, { recursive: true });
fs.mkdirSync(userLogsDir, { recursive: true });

// Sanitize MAC address
function safeFileName(name: string) {
  return name.replace(/:/g, "_").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
}

// Shared global logger for activity.log
const activityLogPath = path.join(allLogsDir, "activity.log");
const activityLogger = winston.createLogger({
  level: "verbose",
  format: winston.format.printf(({ level, message }) => {
    const logData = typeof message === "string" ? JSON.parse(message) : message;
    return `[${level.toUpperCase()}] ${JSON.stringify(logData)}`;
  }),
  transports: [
    new winston.transports.File({ filename: activityLogPath }),
    new winston.transports.Console({ format: winston.format.colorize() }),
  ],
});

// Main logging function
export function logActivity(data: {
  mac?: string;
  threat?: string;
  time?: string;
  [key: string]: any;
}) {
  const mac = data.mac || "unknown";
  const sanitizedMac = safeFileName(mac);
  const macLogPath = path.join(userLogsDir, `${sanitizedMac}.log`);

  // Make sure the file exists
  if (!fs.existsSync(macLogPath)) {
    fs.writeFileSync(macLogPath, "");
  }

  // Create a one-time logger instance for this request
  const perMacLogger = winston.createLogger({
    level: "verbose",
    format: winston.format.printf(({ level, message }) => {
      const logData = typeof message === "string" ? JSON.parse(message) : message;
      return `[${level.toUpperCase()}] ${JSON.stringify(logData)}`;
    }),
    transports: [new winston.transports.File({ filename: macLogPath })],
    exitOnError: false,
  });

  // Determine log level
  const threat = data.threat;
  let level: "info" | "warn" | "verbose" = "info";

  if (threat === "Storage Device" || threat === "Portable Device") {
    level = "warn";
  } else if (threat === "Screen shot"||threat ===  "Print"|| threat === "Download") {
    level = "verbose";
  }

  const logMessage = JSON.stringify(data);

  // Log to both files
  activityLogger.log({ level, message: logMessage });
  perMacLogger.log({ level, message: logMessage });

  // Optional: close the logger manually (flushes resources faster)
  perMacLogger.close();
}
