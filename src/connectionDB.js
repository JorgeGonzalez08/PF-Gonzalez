import mongoose from "mongoose"

export const connectDB = async(url, dbName)=>{
    try {
        await mongoose.connect(url,{dbName:dbName})
        console.log('Conexion exitosa a DB')
    } catch (error) {
        console.log(`error al conectar a DB: ${error.message}`)
    }
}