const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
    phoneNumber:{
        type: String,
        required:true,
        unique:true
    },
    code:{
        type: String,
        required:true,
    }
});

module.exports = mongoose.model('authmodel',AuthSchema)