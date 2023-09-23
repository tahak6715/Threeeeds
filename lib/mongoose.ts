import { Console } from 'console';
import mongoose from 'mongoose'

let isconnected = false;

export const connToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_URL){
        console.log("URL is not provided");
    }

    if(isconnected){
        console.log("Connetion is established");
    }

    try{
        await mongoose.connect( "mongodb+srv://taha:taha@cluster0.npnutzd.mongodb.net/?retryWrites=true&w=majority" )
        isconnected = true;

        console.log("Connected to DB")



    } catch(err){
        console.log(err)

    }
}