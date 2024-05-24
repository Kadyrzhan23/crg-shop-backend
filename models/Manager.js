import mongoose from "mongoose";

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

export default mongoose.model('manager', ManagerSchema);