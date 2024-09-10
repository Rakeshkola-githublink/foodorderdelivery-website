import express from 'express'
import { addFood,llistFood,removeFoodItem } from '../controllers/foodControllers.js'
import multer from 'multer'

//using this router we can create get,ost,put,delete ,create methods
const foodRouter = express.Router();
//Image Storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()} ${file.originalname}`)
    }
})

const upload= multer({storage:storage})



foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.get("/list",llistFood)
foodRouter.post("/remove",removeFoodItem)

export default foodRouter;