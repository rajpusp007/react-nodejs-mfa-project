import { connect } from "mongoose";
import dns from "node:dns";
import dotenv from "dotenv";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const dbConnect = async () =>{
  try{
    const mongoDbConnection = await connect(process.env.CONNECTION_STRING);
    console.log(`Database connected: ${mongoDbConnection.connection.host}`);
    
  }catch (error) {
    console.error(`Database connection failed ${error}`);
    process.exit(1);
    
  }
};

export default dbConnect;