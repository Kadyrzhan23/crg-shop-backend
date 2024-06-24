import mongoose from "mongoose";

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

export default mongoose.model('tokenmodel',TokenSchema)