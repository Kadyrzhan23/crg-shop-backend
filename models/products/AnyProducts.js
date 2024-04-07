
import mongoose from "mongoose";

const AnyProducts = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    description:{
        type:String,
    },
    priceUser:{
        type:Array,
        required:true,
    },
    priceWS:{
        type:Array,
        required:true,
    },
    img:{
        type:Array,
        required:true,
    },
    type:{
        type:String,
        required:true,
    }
})

export default mongoose.model('Products',AnyProducts);