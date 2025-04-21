import { senderVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { messageSchema } from "@/schemas/messageSchema";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
    await dbConnect() ;

    try {
       const {username,email,password} = await request.json() ;

       const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified:true
       })

       if(existingUserByUsername){
        return Response.json({
            success:false,
            message:"Username is already taken."
        },{
            status: 400
        })
       }

       const existingUserByEmail = await UserModel.findOne({email}) ;
       const verifyCode = Math.floor(100000 + Math.random()*900000).toString() ;

       if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message:"User exist with this email."
                },{status:500})
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10) ;

                existingUserByEmail.password = hashedPassword ;
                existingUserByEmail.verifyCode = verifyCode ;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save() ;
            }
       }else{
        const hashedPassword = await bcrypt.hash(password,10) ;
        const expiryDate = new Date() ;
        expiryDate.setHours(expiryDate.getHours() + 1) ;

        const newUser = new UserModel({
                username ,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
        })

        await newUser.save() ;
       }

       //send VerificationMail

       const  emailRespones =  await senderVerificationEmail(
        username,
        email,
        verifyCode
       )

       if(!emailRespones.success){
        return Response.json({
            success: false,
            message:emailRespones.message
        },{status:500})
       }

       return Response.json({
        success: true,
        message:"Userregistered, Please verify User."
       },{status:400})



        
    } catch (error) {
        console.error("Error registering user",error) ;
        return Response.json({
            success: false,
            message: "Error registering user."
        },{
            status: 500
        })
    }

   
}