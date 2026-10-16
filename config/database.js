        import mongoose from 'mongoose';

        const connectDB = async ()=>{
        
                await mongoose.connect(process.env.MONGO_URL);
                console.log("connected to db successfully");  // if error comes promise throw that error 
        };

        export default connectDB;