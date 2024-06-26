const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    chat_id:{
        type:String,
        requered:true,
    },
    id:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model('manager', ManagerSchema);