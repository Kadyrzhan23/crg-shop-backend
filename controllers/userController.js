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
            avatarUrl: req.body.avatarUrl,
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
        if (err?.keyPattern?.email) {
            res.status(401).json({ message: 'Email уже зарегистрирован' })
            return
        }
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
            return res.status(403).json({
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

export const getAccess = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.sendStatus(404).json({
                message: 'Пользователь не найден'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user || user._doc.role !== 'admin') return res.status(403).json({
            message: 'Нет доступа'
        })

        const allUsers = await UserModel.find()
        if (!allUsers) throw new Error('Произошло ошибка или нет зарегистрированных пользователей')

        res.status(200).json(allUsers)
    } catch (error) {
        req.status(500).json({ message: 'Что-то пошло не так' })
    }
};

export const userLevelUp = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.currentUserId)

        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' })
        }

        await UserModel.findByIdAndUpdate({ _id: req.body.currentUserId }, {
            role: "superUser"
        })

        res.status(200).json({ message: 'Уровен пользователя поднято' })
    } catch (error) {
        res.status(500).json({ message: 'Что то пошло не так' })
    }
}

export const getUserInfo = async (req, res) => {
    try {
        const id = req.params.id

        const user = await UserModel.findById(id)

        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }
        const {password , ...info} = user._doc
        res.status(200).json(info)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}