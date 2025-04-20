import mongoose , {Schema,Document} from "mongoose";

export interface Message extends Document{
    content : String;
    createdAt: Date
}

const MessageSchema:Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type:Date,
        required: true,
        default: Date.now
    }

})

export interface User extends Document{
    username : String;
    email: string ;
    password: string ;
    verifyCode: string ;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[] 
}

const UserSchema:Schema<User> = new Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        
    },
    username: {
        type: String,
        required: true,
        unique:true,

    },
    password: {
        type: String,
        required: true,
        unique:true,

    },
    verifyCode: {
        type: String,
        required: true,
    },
   
    verifyCodeExpiry: {
        type: Date,
        required: [true,"Verify code Expiry is required."],
    },
    isVerified: {
        type: Boolean,
        default:false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default:true ,
    },
    message: [MessageSchema]
    
   

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel