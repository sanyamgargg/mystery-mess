import {resend} from "@/lib/resend" ;
import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "@/types/ApiRespons"; ;

export async function senderVerificationEmail(
    email:string,
    username:string,
    verifyCode: string
):Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: verifyCode,
            react: VerificationEmail({ username , otp:verifyCode}),
          });
        return {
            success:true,
            message:"Sent Verificaiton Email Successfully."
        }
    }
    catch(emailError){
        console.log("Error Sending Verification Email.",emailError)
        return {
            success:false,
            message:"Failed to send Verificaiton Email."
        }
    }
}