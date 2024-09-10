import mongoose from 'mongoose'
export const connectDB= async()=>{
    await mongoose.connect('mongodb+srv://Rakesh:Rakesh12@cluster0.3qdz2pv.mongodb.net/food-delivery').then(()=>console.log("DB Connected"));
}