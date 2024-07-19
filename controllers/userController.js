import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from '../models/User.js'
import ManagerModel from '../models/Manager.js'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const salt = await bcrypt.genSalt(10)
        // const passwordHash = await bcrypt.hash(req.body.phoneNumber, salt)

        const regexp = /\+998/
        const bool = regexp.test(req.body.phoneNumber)
        const phoneNumber = bool ? req.body.phoneNumber : `+998${req.body.phoneNumber}`
        const managers = await ManagerModel.find()
        if (!bool && req.body.phoneNumber.length !== 9) {
            res.status(401).json({ message: 'Invalid phone number' })
        }

        let doc = new UserModel({
            name: req.body.name,
            phoneNumber: phoneNumber,
            role: req.body.role,
            city: req.body.city,
            address: req.body.address,
            telegram: req.body.telegram,
            avatarUrl: req.body.avatarUrl,
            manager:managers[0]
            // password: passwordHash
        })
        if (req.body.hasOwnProperty("email")) doc.email = req.body.email
        else doc.email = `default:${+new Date()}`
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
        if (err?.keyPattern?.phoneNumber) {
            res.status(401).json({ message: 'Указанный номер уже зарегистрирован' })
            return
        }
        res.status(500).json({ message: "Не удалось зарегистрироватся" })
    }
}

export const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const user = await UserModel.findOne({ phoneNumber: req.body.phoneNumber })
        if (user === null) {
            return res.status(404).json({
                message: 'Пользователь с таким номером не зарегистрирован'
            })
        }


        const { password, ...userData } = user._doc

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', { expiresIn: '30d' })
        res.status(200).json({success:true})
    } catch (error) {
        res.status(500).json({ message: "Не удалось авторизоватся" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const { password, ...userData } = user._doc
        const a = {
            "_id":"6650a050eb77f3f2685b0517",
            "name": "Жавохир Ахмедов",
            "phoneNumber": "+998909927144",
            "role": "admin",
            "address": [
                "Nurafshon, 8"
            ],
            "telegram": "@exxxxpresso",
            "avatarUrl": "uploads/1716833232247.jpg",
            "organization": [],
            "isActive": true,
            "manager": {
                "_id": "664e5cc082d55ec269275d88",
                "name": "Manager 2",
                "chat_id": "",
                "id": "6650a050eb77f3f2685b0517",
                "__v": 0
            },
            "email": "reddou4@mail.ru",
            "__v": 0
        }

        return res.json({
            ...userData
        })

    } catch (error) {
        res.status(404).json({
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
        const managers = await ManagerModel.find()
        if (!user) {
            res.status(404).json({ message: 'Пользователь не найден' })
        }

        await UserModel.findByIdAndUpdate({ _id: req.body.currentUserId }, {
            role: "superUser",
            manager:managers[1]
        })

        res.status(200).json({ message: 'Уровен пользователя поднято' })
    } catch (error) {
        console.log(error)
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
        const { password, ...info } = user._doc
        res.status(200).json(info)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
}

export const update = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            res.status(404).json({
                message: 'Пользователь не найден или ваш аккаунт заблокирован'
            })
        }

        const response = await UserModel.findByIdAndUpdate({ _id: req.userId }, {
            name: req.body.name !== '' ? req.body.name : user.name,
            email: req.body.email !== '' ? req.body.email : user.email,
            phoneNumber: req.body.phoneNumber !== '' ? req.body.phoneNumber : user.phoneNumber,
            telegram: req.body.telegram !== '' ? req.body.telegram : user.telegram,
            address: req.body.address !== '' ? req.body.address : user.address,
            avatarUrl: req.body.avatarUrl !== '' ? req.body.avatarUrl : user.avatarUrl
        })
        res.status(200).json(response)

    } catch (e) {
        console.log(e)
        if (e?.keyPattern?.email) {
            res.status(500).json({ message: `Email ${e?.keyValue.email} уже зарегистрирован` })
        } else if (e?.keyPattern?.phoneNumber) {
            res.status(500).json({ message: `Номер телефона ${e?.keyValue.phoneNumber} уже зарегистрирован` })
        } else {
            res.status(500).json({ message: 'Ошибка на сервере' })
        }
    }
}

export const block = async (req, res) => {
    try {
        console.log(req.body)
        await UserModel.findByIdAndUpdate({ _id: req.body.user }, {
            isActive: false
        })

        res.status(200).json({ message: 'Статус успешно обновлён' })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' })
        // console.log(error)
    }
}

export const unlock = async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate({ _id: req.body.user }, {
            isActive: true
        })

        res.status(200).json({ message: 'Статус успешно обновлён' })
    } catch (error) {
        res.status(500).json({ message: 'Что-то пошло не так' })
    }
}

export const verifyRegister = async (req, res) => {
    try {
        const users = await UserModel.find()
        const { phoneNumber, email } = req.body
        if (!users) return res.status(500).json({ message: 'Ошибка на сервере' })

        users.map((user) => {
            if (user.phoneNumber === phoneNumber) {
                // bool = true
                throw new Error('Указанный вами номер телефона уже зарегистрирован')
            }
            if (user.email === email) {
                // bool = true

                throw new Error('Указанный вами email телефона уже зарегистрирован')
            }
        })
        res.status(200).json({ success: true })
    } catch (error) {
        res.status(401).json({
            message: error?.message ? error.message : error
        })
    }
}

