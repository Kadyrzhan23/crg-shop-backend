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
    }

},
    {
        timestamps: true,
    }
);

export default mongoose.model('Order', OrderSchema);