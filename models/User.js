import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        unique: true,
        type: String,
    },
    phoneNumber: {
        unique: true,
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
        default:[]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    manager:{
        type:String,
        default:''
    }
},
    {
        timestamp: true
    }
)
export default mongoose.model('User', UserSchema);
 