import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    user:{
        type: Object,
        required: true,
    },
    listProducts: {
        type: Array,
        required: true,
    },
    creationDate: {
        type: String,
        required: true,
    },
    departureDate: {
        type: String,
        default: null,
    },
    address:{
        type: String,
        required: true,
    },
    closingDate: {
        type: String,
        default: null,
    },
    comment:{
        type: String,
        default: null,
    },
    status:{
        type: String,
        default: "В ожидании",
    },
    totalPrice:{
        type:String,
        required: true,
    },
    rejectedList:{
        type:Array,
        default: [],
    },
    telegram:{
        type:Object,
        default: {},
    },
    paymentMethod:{
        type:String,
        required: true,
    },
    identifier:{
        type:String,
        required: true,
    },
    userStatus:{
        type:String,
        required: true,
    },
    manager:{
        type:Object,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', OrderSchema);