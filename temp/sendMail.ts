import {createTransport} from 'nodemailer';
import { postgresPool } from './loginFunctions.ts';
import { QueryResult } from 'pg';
import{hash,compare } from 'bcrypt';
import {} from 'dotenv'
// import { passValidate } from './hashing';

/**
 * function to send otp to user through gmail
 * @param userName username or gmail of the user
 * @returns sends an otp to the user
 * */
export async function sendOtp({userName}:{userName:string}){ 
    let timeOutId
        if(timeOutId){
            clearTimeout(timeOutId)
        }
    const otp = Math.floor(Math.random()*1000000)
    const hashOtp = await hash(String(otp),10)
    postgresPool.query(`INSERT INTO userOtp(uid,hashOtp) VALUES('${userName}','${hashOtp}') ON CONFLICT (uid) 
                        DO UPDATE SET hashOtp = Excluded.hashOtp`)
    const trasporter = createTransport({
        host: 'smtp.gmail.com',
        auth:{
            user:'bharathkumar91081@gmail.com',
            pass:'zdmi hztu bpnw wjet'
        }
    });
    let mailOptions = {
        from:'bharathkumar91081@gmail.com',
        to: userName,
        subject:'Password Reset Verification',
        text:"OTP for Password reset is "  + otp
    }
    trasporter.sendMail(mailOptions,function (error,info){
        if(error){
            console.log(error)
        }
        else{
        console.log("Mail sent successfully")
        console.log(info.response)
        }
    })

   timeOutId = setTimeout(()=>{
        postgresPool.query(`delete from userotp where uid = '${userName}' `)
    },300000)

}

/**
 * 
 * @param userName user name of the user 
 * @param otp otp that recieved by the user
 * @returns true if otp is matched and false if otp is not matched
 */
export async function otpVerification({userName,otp}:{userName: string,otp:string}){
    // const hashPass:QueryResult = await postgresPool.query(`SELECT pass from userLogin WHERE uid = '${userName}'`)
    const otpVerify:QueryResult = await postgresPool.query(`SELECT hashOtp from userOtp WHERE uid = '${userName}'`)
    const val = await  compare(otp,otpVerify.rows[0].hashotp)
    if(val){
        return true
        // if (passValidate({pass:newPass}) && !(await compare(newPass,hashPass.rows[0].pass))){
        //     const hashPass = await hash(newPass,10)
        //     const query = `Update userLogin set pass = '${hashPass}' where uid = '${userName}'`
        //     await postgresPool.query(query)
        //     console.log("password updated successfully")
        //     await postgresPool.end();
        // }else if(passValidate({pass:newPass}) && await compare(newPass,hashPass.rows[0].pass)){
        //     console.log("Cannot Enter a Old password.")
        // }
        // else{
        //     console.log("Enter a strong password")
        // }
    }else{
        return false
    }
}

// sendOtp({userName:'bharathkumar04081@gmail.com'})
// otpVerification({userName:'bharathkumar04081@gmail.com',otp:'467364'})
