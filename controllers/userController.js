import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, salt)

        const doc = new UserModel({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
            address: req.body.address,
            telegram: req.body.telegram,
            avatarUrl: req.body.avaterUrl,
            password: passwordHash
        })

        const user = await doc.save()
        const { password, ...userData } = user._doc

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', { expiresIn: '30d' })
        res.json({ ...userData, token })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Не удалось зарегистрироватся" })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.password)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const { password, ...userData } = user._doc

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', { expiresIn: '30d' })
        res.json({ ...userData, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Не удалось авторизоватся" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.sendStatus(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { password, ...userData } = user._doc


        res.json({
            ...userData
        })

    } catch (error) {
        return res.sendStatus(404).json({
            message: 'Нет доступа'
        })
    }
}