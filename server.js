import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

//app-config

const app= express()
const port = process.env.PORT || 4000;

//middleware
//app.use(express.jon()) using this middleware to parse the request from frontend to backend

app.use(express.json())
//app.use(core()) using this we can access backend from any frontend
app.use(cors())
//db connection

connectDB();
//api endpoints

app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))

app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/order/verify",orderRouter)
app.use("/api/order/userorders",orderRouter)
app.use("/api/order/list",orderRouter)
app.use("/api/order/status",orderRouter)
//using this to get data from server
app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

