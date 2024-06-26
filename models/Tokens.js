const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        unique:true
    },
    token:{
        type: String,
        required:true,
    }
})

module.exports = mongoose.model('tokenmodel',TokenSchema)