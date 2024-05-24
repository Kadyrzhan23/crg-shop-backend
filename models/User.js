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
        type:[],
        default:[]
    },
    isActive:{
        type:Boolean,
        default:true
    },
    manager:{
        type:Object,
        default:{
            "name":"Manager 1",
            "id":"12345",
            "chat_id":""
        }
    },
    city:{
        type:String,
    }
},
    {
        timestamp: true
    }
)
export default mongoose.model('User', UserSchema);
 