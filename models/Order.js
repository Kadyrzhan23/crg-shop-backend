import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
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
    }

},
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', OrderSchema);