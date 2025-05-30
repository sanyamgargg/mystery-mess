import { NextAuthOptions } from "next-auth"; 
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User"; 



export const authOptions : NextAuthOptions ={
    providers : [
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"email", type:"text"},
                password:{label:"password", type:"password"}
            } ,

            async authorize(credentials:any) : Promise<any>{
                await dbConnect() ;
                try{
                    const user = await UserModel.findOne({
                        $or : [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("No user found wiht this email.")
                    }

                    if(!user.isVerified){
                        throw new Error("user is not verified.")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user ;
                    }
                    else{
                        throw new Error("Password incorrect.")
                    }


                }catch(err:any){
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
       
        async jwt({ token, user}) {
            if(user){
                token._id = user.id?.toString();
                token.isVerified = user.isVerified ;
                token.isAcceptingMessage = user.isAcceptingMessage ;
                token.username = user.username
            }
          return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id ;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage ;
                session.user.username = token.username
            }
            return session
        }
          
        },
    pages:{
        signIn:"/signin"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}