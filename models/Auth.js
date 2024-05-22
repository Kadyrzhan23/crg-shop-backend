import mongoose from "mongoose";

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

export default mongoose.model('authmodel',AuthSchema)