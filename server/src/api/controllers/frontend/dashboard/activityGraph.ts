import * as fs from 'fs';
import * as readline from 'readline';
import {Request,Response} from 'express'

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

type Summary = {
  [date: string]: {
    data: {
      [level in LogLevel]?: {
        count: number;
        threats: Set<string>;
      };
    };
    total_count: number;
  };
};

const summary: Summary = {};

async function processLogFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.startsWith('[')) continue;

    try {
      const levelMatch = line.match(/^\[(\w+)\]/);
      if (!levelMatch) continue;

      const level = levelMatch[1].toLowerCase() as LogLevel;
      if (!['verbose', 'info', 'warn'].includes(level)) continue;

      const jsonPart = line.substring(levelMatch[0].length + 1);
      const logData = JSON.parse(jsonPart) as LogEntry;

      const date = logData.time.slice(0, 10);
      const threat = logData.threat || 'Unknown';

      // Initialize date group if not exists
      if (!summary[date]) {
        summary[date] = { data: {}, total_count: 0 };
      }

      const daySummary = summary[date];

      if (!daySummary.data[level]) {
        daySummary.data[level] = { count: 0, threats: new Set() };
      }

      daySummary.data[level]!.count += 1;
      daySummary.data[level]!.threats.add(threat);
      daySummary.total_count += 1;

    } catch (err) {
      console.error(`Failed to parse line: ${line}`, err);
    }
  }

  const result = Object.entries(summary).map(([date, { data, total_count }]) => ({
    date,
    data: Object.entries(data).map(([level, info]) => ({
      level,
      color: LEVEL_COLORS[level as LogLevel],
      count: info!.count,
      name: Array.from(info!.threats).join(', ')
    })),
    total_count
  }));

  // console.log(JSON.stringify(result, null, 2));
  return result;
}

export const activityGraph = async (req:Request,res:Response)=>{
  const data = await processLogFile('server\\src\\infrastructure\\logger\\logs\\allLogs\\activity.log');
  res.send(data)
  return
}