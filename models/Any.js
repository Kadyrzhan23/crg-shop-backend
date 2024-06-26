const mongoose = require("mongoose");

const AnySchema = new mongoose.Schema({
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
    },
    tags:{
        type:Array,
        required:true,
    }
})

export default mongoose.model('post',AnySchema);