import mongoose from "mongoose";

const TeaSchema = new mongoose.Schema({
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
    whatTea:{
        type:String,
        required:true,
    },
    package:{
        type:Array,
        required:true,
    },
    type:{
        type:String,
        required:true,
    }
})

export default mongoose.model('post',TeaSchema);