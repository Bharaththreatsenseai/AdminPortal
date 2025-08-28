import { policyTable,roleTable,userGroupTable,userTable } from "./dbTables.ts";
import {client} from "../dbConnectivityFunctions/dbConnection.ts"
async function createTables(){
await policyTable();
await roleTable();
await userGroupTable();
await userTable();
(await client).release();
}
createTables();