import{Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config()
const hostName = process.env.host
const userName = process.env.user
const pass = process.env.password
const portNo = process.env.port
const db = process.env.database
const dbConfig = ({                 // configure the database
    host:hostName,
    user:userName,
    password: pass,
    port: Number(portNo),
    database:db
});
export const postgresPool = new Pool(dbConfig);
export const client = postgresPool.connect();