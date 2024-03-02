import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true
    },
    description:{
        type:String,
        required:true,
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
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    sort:{
        type:String,
        required:true,
    },
    region:{
        type:String,
        required:true,
    },
    weight:{
        type:Array,
        required:true,
    },
    descriptors:{
        type:String,
        required:true,
    },
    scaScore:{
        type:String,
        required:true,
    },
    roast:{
        type:String,
        required:true,
    },
    scores:{
        type:String,
        required:true,
    },
    acidity:{
        type:Number,
        default:0,
    },
    density:{
        type:Number,
        default:0,
    },
    forWhat:{
        type:String,
        // required:true,f
        default:''
    },
    treatment:{
        type:String,
        required:true,
    }
})

export default mongoose.model('Post',PostSchema)
