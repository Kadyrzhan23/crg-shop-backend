import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'


export default async(req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123')
            req.userId = decoded._id
            const user = await UserModel.findById(req.userId)
            req.userInfo = user
            next()
        } catch (error) {
            console.log(error)
            return res.status(403).json({
                message: "Нет доступа"
            })
        }
    } else {
        console.log(token)
        return res.status(403).json({
            message: "Нет доступа"
        })
    }
}