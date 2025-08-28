import { postgresPool,client } from "./dbConnection.ts";
import { QueryResult } from "pg";

/**
 * ceates a table in database
 * @param root named params
 * @param root.tableName name of the table
 * @param root.tableFields colums of the table
 * @returns none
 */
export async function createTable({tableName, tableFields}:{tableName:string,tableFields:string}){
    (await  client).query("CREATE TABLE "+ tableName + "("+tableFields+")")
    
    // console.log("Table created successfully");
    }
// createTable({tableName: "Table1", tableFields: "Id INT PRIMARY KEY,Name VARCHAR(20)"})

/**
 * insert values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table
 * @param root.columnName column names of the table
 * @param root.values values to be inserted
 */
export async function tableInsertion({tableName,columnName,values}:{tableName:string,columnName:string,values:string}){
    (await client).query("INSERT INTO "+tableName+"("+columnName+")VALUES"+values+"");
    console.log("Inserted values successfully.");
    (await client).release();
}

/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table
 * @param root.updateValue value to be updated
 * @param root.fromValue values that need to get update
 */
export async function tableUpdate({tableName,updateValue,fromValue}:{tableName:string,updateValue:string,fromValue:string}){
    await postgresPool.query("UPDATE "+tableName+" SET "+updateValue+" WHERE "+fromValue)
    console.log("Updated Table");
    (await client).release();
}

/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table
 * @param root.deleteValue value to be deleted
 */
export async function tableDeleteValue({tableName,deleteValue}:{tableName:string,deleteValue:string}){
    (await client).query("DELETE FROM "+tableName+" WHERE "+deleteValue)
    console.log("Value deleted successfully");
    (await client).release()
}

/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table
 * @param root.columnName name of the columns
 * @param root.values values that need to get update
 * @param root.conflictColumn column with unique key
 * @param root.condition condition that need to et execute such as DO UPDATE || DO NOTHING
 */
export async function tableUpsert({tableName,columnName,values,conflictColumn,condition}:{tableName:string,columnName:string,values:string,conflictColumn:string,condition:string}){
    (await client).query(
        "INSERT INTO "+tableName+
        "("+columnName+
        ")VALUES"+ values+
        "ON CONFLICT("+conflictColumn+") "
        +condition
    );
    console.log("Upsert successfully");
    (await client).release()
}
// tableUpsert({tableName:"table4",columnName:"Id, Name",values:"(1,'A')",conflictColumn:"id",condition:"DO UPDATE SET Id=Excluded.Id,Name=Excluded.Name"})


/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table
 */
export async function tableDeletion({tableName}:{tableName:string}){
    (await client).query("DROP TABLE "+tableName)
    console.log("Table deleted successfully");
    (await client).release()
}

// tableDeletion({tableName:"table2"})

/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.columnName name of column that need to select
 * @param root.tableName table name
 * @param root.condition condition to select the record such as "WHERE","ORDER BY","GROUP BY"
 */
export async function selection({columnName,tableName,condition}:{columnName:string,tableName:string,condition:string}){
    const dbresult:QueryResult=await  (await client).query("SELECT "+columnName+" from "+tableName+" "+condition);
    // console.log(dbresult.rows)
    return dbresult.rows
}
 
// selection({columnName:"*",tableName:"table4",condition:""})

/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table
 * @param root.editFunction function that need to perform such as "ADD","DROP","MODIFY"
 * @param root.columnName Name of the column that need to get modified
 * @param root.dataType Type of the column such as VARCHAR() , INT
 * @param root.newName new name of column if wants to get rename
 */
export async function editColumn({tableName,editFunction,columnName,dataType,newName}:{tableName:string,editFunction:string,columnName:string,dataType:string,newName:string}){   
    (await client).query(
        "ALTER TABLE "+ tableName 
        +" "+ editFunction +
        " COLUMN " + columnName +" "+ dataType + " "+newName
    )
    console.log("Column "+editFunction+" successfully");
    (await client).release()
 }

// editColumn({tableName:"table4",editFunction:"ADD",columnName:"add",dataType:"VARCHAR(30)",newName:""})

/**
 * update values into selected table in postgres database
 * @param root named paramas
 * @param root.tableName   name of the table that need to get renamed
 * @param root.newName new name that need to get assigned
 */
export async function renameTable({tableName,newName}:{tableName:string,newName:string}){
    (await client).query("ALTER TABLE  "+tableName+" RENAME TO "+newName)
    console.log("Table renamed ");
    (await client).release()
}

// renameTable({tableName:"Table1",newName:"Table4"})



export async function createSequence({tableName,columnName,startVal}:{tableName:string,columnName:string,startVal:string}){
    (await client).query('ALTER SEQUENCE '+tableName+'_'+columnName+'_seq RESTART WITH '+startVal);
    (await client).release();
}