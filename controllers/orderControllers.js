import ordelModel from "../models/orderModels.js";
import userModel from "../models/userModle.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' }); // Ensure you specify the API version

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";
    try {
        // Create a new order
        const newOrder = new ordelModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address // Ensure this matches your schema
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Create line items for Stripe
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {  // Ensure this is 'product_data'
                    name: item.name
                },
                unit_amount: item.price *80 // Convert price to the smallest unit (cents)
            },
            quantity: item.quantity // Ensure this is an integer
        }));

        // Add delivery charges to line items
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {  // Ensure this is 'product_data'
                    name: "Delivery Charges"
                },
                unit_amount: 2*100*80 // Delivery charge in the smallest currency unit (cents)
            },
            quantity: 1 // Ensure this is an integer
        });

        // Create a checkout session with Stripe
        const session = await stripe.checkout.sessions.create({
           
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        });

        // Send the session URL to the frontend
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log( error);
        res.json({ success: false, message: error.message });
    }
};
const verifyOrder= async(req,res)=>{
const{orderId,success} = req.body;
try {

    if (success==="true") {
        await ordelModel.findByIdAndUpdate(orderId,{payment:true})
        res.json({success:true,message:"Paid"})
    }
    else{
        await ordelModel.findByIdAndDelete(orderId)
        res.json({success:false,message:"Not Paid"})
    }
    
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
}

}

const userOrders = async(req,res)=>{
    try {
        const orders= await ordelModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

   
   


}
 //Listing orders for  admin panel
 const listOrders = async(req,res)=>{
    try {
     const orders = await ordelModel.find({})
     res.json({success:true,data:orders})
    } catch (error) {
     console.log(error);
     res.json({success:false,message:"Error"})
    }
 }

 // update order status

 const updateOrderStatus= async(req,res)=>{
    try {
        await ordelModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

 }
export { placeOrder,verifyOrder,userOrders,listOrders,updateOrderStatus};
