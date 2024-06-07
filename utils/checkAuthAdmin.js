import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
export default async (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123')
            req.userId = decoded._id
            const user = await UserModel.findById(req.userId)
            if (user.role === 'admin' || user.role === 'operator') {
                req.userName = user.name
                next()
            } else {
                return res.status(403).json({
                    message: "Нет доступа"
                })
            }
        } catch (error) {
            return res.status(403).json({
                message: "Нет доступа"
            })
        }
    } else {
        return res.status(403).json({
            message: "Нет доступа"
        })
    }
}