import {hash,compare} from 'bcrypt';
import{Pool,QueryResult} from 'pg';
import { sendOtp,otpVerification } from './sendMail.ts';
const dbConfig = ({                 // configure the database
    host:"localhost",
    user:"postgres",
    password:"",
    port: 5432,
    database:"postgres"
});
export const postgresPool = new Pool(dbConfig);
export const client = postgresPool.connect()

/**
 * User login || Login user into system
 * @param userName username of the user
 * @param pass login password of the user
 * @returns login a user if the credentials are correct else doesnt login
 */
async function userLogin({userName ,pass}:{userName:string,pass:string}){
    const val = await userIdCheck({uid:userName})
    if(val){
    console.log("User doesnot exist.")
    return false
    }
    else{
        const hashPass:QueryResult = await postgresPool.query(`SELECT pass from userLogin WHERE uid = '${userName}'`)
        const success =await  compare(pass,hashPass.rows[0].pass)
        if(success == true ){
        console.log("Login successfully")
        return true
    }
    else{
        console.log("password incorrect")
        return false
    }
    }    
}

/**
 * User sign up
 * @param userName Username of the User or Client
 * @param pass Login Password of the User or Client 
 * @returns adds new user
 */
async function userSignUp({userName,pass}:{userName:string,pass:string}){

    const passResult = passValidate({pass:pass})
    if(passResult){
        const val = await userIdCheck({uid:userName})
        if(val){
            hash(pass,10,function (err,hash){
            
                if(err){
                    console.log(err)
                }
                else{
                    const query =`INSERT INTO userLogin(uid,pass) Values('${userName}','${hash}')`
                    postgresPool.query(query);
                    console.log("User created successfully")
                }
             })
        }
        else{
            console.log("User already exists")
        }
    }
    else{
    console.log("Enter a strong password")
    }

}
/**
 * Checks if user exist in a system or not
 * @param uid : username of the user
 * @returns returns a boolean value 
 * "true" when user doesnt exist
 * "false" when user exist
 */

export async function userIdCheck({uid}:{uid:string}){
    const idValue:QueryResult = await postgresPool.query(`SELECT uid from userLogin WHERE uid ='${uid}' `)
    if(idValue.rows.length === 0){
        return true
    }else {
            return false
    
}}

/**
 * 
 * @param userName username of the user or client
 * @param oldPass current usable password of the user
 * @param newPass new password that need to set instead of old password
 * @returns Changes the user password if credentials are correct else does nothing
 */
async function changePass({userName,oldPass,newPass}:{userName:string,oldPass:string,newPass:string}){
      const val = await userIdCheck({uid:userName})
      if(val){
        console.log("User does not exist")
      }
      else{
        if(await userLogin({userName:userName,pass:oldPass})){
        if (passValidate({pass:newPass})){
        const client = await postgresPool.connect();
        hash(newPass,10,async function (err,hash){
        await client.query(`Update userLogin set pass = '${hash}' where uid='${userName}'`)
        console.log("password updated successfull")
        client.release()
        })
      }
      else{
        console.log("Enter a strong password")
      }
    }
    else{
        console.log("Incorrect username or password")
    }
    }

}

/**
 * Verify the password strength
 * @param pass password that need to set
 * @returns boolean value "true" if pass satisfies all conditions else return "false"
 */

export function passValidate({pass}:{pass:string}){
    const validator = require('password-validator')
    const passStruct = new validator()
    passStruct.is()
        .min(8) // Minimum length
        .is()
        .max(100) // Maximum length
        .has()
        .uppercase() // Must have uppercase letters
        .has()
        .lowercase() // Must have lowercase letters
        .has()
        .digits() // Must have digits
        .has()
        .symbols() // Must have special characters
        .has()
        .not()
        .spaces(); // Should not contain spaces
     const passResult = passStruct.validate(pass);
     return passResult
}

/**
 * Resetting the password of the user through otp verification
 * @param userName username or gmail of the user
 *@returns reset the password of the user
 */
async function resetPass({userName}:{userName:string}){
    const val = await userIdCheck({uid:userName})
    if(val){
        console.log("user doesnot exist ")
    }
    else{
        await sendOtp({userName:userName})

        // 
        // enter otp code 
        //

        const val = await otpVerification({userName:userName,otp:''})
        if (val){
            const hashPass:QueryResult = await postgresPool.query(`SELECT pass from userLogin WHERE uid = '${userName}'`)
           
            //
            //newPass code 
            //

            const newPass = ""
            if (passValidate({pass:newPass}) && !(await compare(newPass,hashPass.rows[0].pass))){
                const hashPass = await hash(newPass,10)
                const query = `Update userLogin set pass = '${hashPass}' where uid = '${userName}'`
                await postgresPool.query(query)
                console.log("password updated successfully")
                await postgresPool.end();
            }else if(passValidate({pass:newPass}) && await compare(newPass,hashPass.rows[0].pass)){
                    console.log("Cannot Enter a old password.")
            }else{
            console.log("Enter a strong password")
            }
        }else {
            console.log("Incorrect otp ")
        }
    }
}
// userSignUp({userName:"bharathkumar0401@gmail.com",pass:"Hello@123"})
// userLogin({userName:"bharathkumar04081@gmail.com",pass:"Bharath@1234"})
// changePass({userName:"bharathkumar04081@gmail.com",oldPass:"Bharath@1234",newPass:"Nothing@123"})