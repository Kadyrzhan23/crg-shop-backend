import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    address: {
        type: Array,
        required: true
    },
    telegram: {
        type: String,
        default: ''
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    organization:{
        type:String,
        default:''
    }
},
    {
        timestamp: true
    }
)
export default mongoose.model('User', UserSchema);
