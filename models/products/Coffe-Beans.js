const mongoose = 'mongoose';

const CoffeBeans = new mongoose.Schema({
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
        required:true,
    },
    density:{
        type:Number,
        required:true,
    },
    treatment:{
        type:String,
        required:true,
    },
    tags:{
        type:Array,
        default:[]
    }
})

export default mongoose.model('Products',CoffeBeans)
