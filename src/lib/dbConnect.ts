import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: Number
}

const connection: ConnectionObject = {} ;

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("DB already connected.")
        return ;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "") ;

        connection.isConnected = db.connections[0].readyState ;

        console.log("DB Connected Successfully.")

    } catch (error) {
        console.log("Connection failed with DB",error) ;
        process.exit(1) ;
    }
  
}

export default dbConnect ;