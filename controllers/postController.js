import PostModel from '../models/Post.js'
import { validationResult } from 'express-validator';

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

export const create = async (req,res)=>{
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
            descriptors:req.body.descriptors,
            scaScore:req.body.scaScore,
            roast:req.body.roast,
            scores:req.body.scores,
            acidity:req.body.acidity,
            density:req.body.density,
            forWhat:req.body.forWhat,
            treatment:req.body.treatment,
            tags:req.body.tags
        })
        const post = await doc.save()

        res.status(200).json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Не удалось создать пост" })
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

