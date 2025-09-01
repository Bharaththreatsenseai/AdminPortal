import * as fs from 'fs';
import * as readline from 'readline';
import { Request, Response } from 'express'

type LogEntry = {
  mac: string;
  remedy: string;
  threat: string;
  time: string;
  tool: string;
  username: string;
};

type LogLevel = 'verbose' | 'info' | 'warn';

const LEVEL_COLORS: Record<LogLevel, string> = {
  verbose: 'yellow',
  info: 'blue',
  warn: 'red',
};

async function getFullLogsByDate(filePath: string, dateFilter: string) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const result: {
    date: string;
    data: {
      time: string;
      level: string;
      user: string;
      threat: string;
      action: string;
      color: string;
    }[];
  } = {
    date: dateFilter,
    data: [],
  };

  for await (const line of rl) {
    if (!line.startsWith("[")) continue;

    try {
      const levelMatch = line.match(/^\[(\w+)\]/);
      if (!levelMatch) continue;

      const level = levelMatch[1].toLowerCase() as LogLevel;
      const jsonPart = line.substring(levelMatch[0].length + 1);
      const logData = JSON.parse(jsonPart) as LogEntry;

      const logDate = logData.time.slice(0, 10); // "2025-08-22"
      // console.log("logDate:", logDate, "filter:", dateFilter);

      if (logDate !== dateFilter) continue;

      result.data.push({
        time: logData.time,
        level: level,
        user: logData.username,
        threat: logData.threat,
        action: logData.remedy,
        color: LEVEL_COLORS[level] || 'grey',
      });

    } catch (err) {
      console.error(`Error parsing log line: ${line}`, err);
    }
  }

//   console.log(JSON.stringify(result, null, 2));
  return result;
}



export const dateGraph = async (req:Request,res:Response)=>{
  const data = await getFullLogsByDate('server\\src\\infrastructure\\logger\\logs\\allLogs\\activity.log', '2025-08-22');
  res.send(data)
  return
}