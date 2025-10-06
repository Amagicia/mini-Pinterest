import mongoose from "mongoose";

const connectdb  = async ()=>{
    try {
        let db = await mongoose.connect(process.env.MONGODB)
        console.log(`✅ Database connected successfully - ${db}`);
        
        
    } catch (error) {
        console.log("❌ Database not connected ",error);
        process.exit(1); 
        
    }
}
export default connectdb;