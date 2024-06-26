const mongoose = require('mongoose');

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
    city: {
        type: String,
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
        required:true
    },
    basket:{
        type:Array,
        default:[]
    }
},
    {
        timestamp: true
    }
)
module.exports = mongoose.model('User', UserSchema);
 