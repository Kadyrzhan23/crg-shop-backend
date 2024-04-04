import PostModel from '../models/Post.js'  
import { validationResult } from 'express-validator';
import TeaModel from '../models/Tea.js';
import mongoose from 'mongoose';
const  OtherProducts = mongoose.models.post || mongoose.model('Post', OtherProducts);

export const getAll = async (req, res,) => {
    try {
        const data = await PostModel.find()
        if(!data){
            return res.status(400).json({
                message:'Не удалось получить статьи'
            })
        }
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Не удалось создать пост" })
    }
}

export const createCoffe = async (req,res)=>{
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = new PostModel({
            name:req.body.name,
            description:req.body.description,
            priceUser:req.body.priceUser,
            priceWS:req.body.priceWS,
            img:req.body.img,
            type:req.body.type,
            sort:req.body.sort,
            region:req.body.region,
            weight:req.body.weight,
            roast:req.body.roast,
            scores:req.body.scores,
            acidity:req.body.acidity,
            density:req.body.density,
            treatment:req.body.treatment,
        })
        const post = await doc.save()

        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Не удалось создать пост" })
    }
}

export const createPostTea = async (req, res) => {
    try {
        const doc = new TeaModel({
            name: req.body.name,
            description: req.body.description,
            priceUser: req.body.priceUser,
            priceWS: req.body.priceWS,
            img: req.body.img,
            package: req.body.package,
            type: req.body.type
        })
        console.log(req.body)

        const post = await doc.save()

        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
}

export const createPostOtherProducts = async (req, res) => {
    try {
        console.log('start')
        const doc = new OtherProducts({
            name: req.body.name,
            description: req.body.description,
            priceUser: req.body.priceUser,
            priceWS: req.body.priceWS,
            img: req.body.img,
            type: req.body.type
        })
        console.log(req.body)

        const post = await doc.save()

        res.status(200).json(post)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message})
    }
}



export const getFavorites = async (req, res) => {
    try {
        const params = req.body.params
        let temp = [];
        params.map((key) => {
            temp.push({_id:(key)})
        })
        const posts = await PostModel.find({ $or: temp})
        res.json(posts)
    } catch (error) {
        res.json({message:error.message})
    }
}

