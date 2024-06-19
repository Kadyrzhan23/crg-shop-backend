const token = `6909778501:AAE4l6b0sJsTsaA2o2-glmJd84Szr_PAY_I`
const chat_id = `-1002019552795`
const uri = `https://api.telegram.org/bot${token}/sendMessage`
import axios from 'axios'
import AuthModel from '../models/Auth.js'
import UserModel from '../models/User.js'
import jwt from 'jsonwebtoken'


export const updateUserCode = async (req, res) => {
    console.log(req)
    console.log(req.message)

    const request = await axios.post(uri, {
        chat_id: chat_id,
        parse_mode: 'html',
        text: debug(req.body),
    })
}


export const sendCode = async (req, res) => {
    try {
        console.log('24')
        if (!req.body.phoneNumber) {
            return res.status(404).json({ message: 'Вернитесь назад и введите данные зоново' })
        }
        // const authStr = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg1NTUyNzIsImlhdCI6MTcxNTk2MzI3Miwicm9sZSI6InVzZXIiLCJzaWduIjoiNWQyZTBhYjIxYjI4NDY1MDk2ZGY3NWQ1ZWE3ZDJjMDVlZjZlNWZlZjVlMTBlZWZkNjZiNDM0ZThhMmZhZTNjOSIsInN1YiI6IjcwODYifQ.t498XthH4FQc7T_DSmlJgTFrvtBLT8KIcljTGDUL6ag"

        console.log('30')
        const code = generateCode()
        const message = `Код подтверждения для сайта crgshop.uz: ${code} Спасибо за ваш выбор!`
        const user = await AuthModel.findOne({ phoneNumber: req.body.phoneNumber })
        console.log('34')
        if (user) {
            await AuthModel.findOneAndUpdate({ phoneNumber: req.body.phoneNumber }, {
                code: code
            })
        } else {
            const doc = new AuthModel({
                phoneNumber: req.body.phoneNumber,
                code: code
            })
            doc.save()
        }

        console.log(process.env.ESKIZ_URL)
        const messageRequest = await axios.post(process.env.ESKIZ_URL,
            {
                mobile_phone: req.body.phoneNumber,
                message: message,
                from: 'Cataleya',
                callbackUrl: ''
            }
            , { headers: { "Authorization": process.env.ESKIZ_AUTH_STR } })
        console.log(messageRequest)
        if (messageRequest.status === 200) {
            res.status(200).json({ success: true })
        } else {
            throw new Error('Что-то пошло не так')
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error?.message ? error.message : error })
    }
}

export const verifyCode = async (req, res, next) => {
    try {
        const { code, phoneNumber } = req.body
        const model = await AuthModel.findOne({ phoneNumber: phoneNumber })

        if (model === null) {
            return res.status(401).json({ message: 'Ваш код устарел или же не доступа' })

        }


        if (model.code === code) {
            await AuthModel.findOneAndDelete({ phoneNumber: phoneNumber })

            const user = await UserModel.findOne({ phoneNumber: phoneNumber })

            if (user !== null) {

                const { password, ...userData } = user._doc
                const a = {
                    "_id": "6650a050eb77f3f2685b0517",
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
                // const token = jwt.sign({
                //     _id: a._id,
                // }, 'secret123', { expiresIn: '30d' })
                // const b = { ...a, token }
                // return res.status(200).json(b)

                const token = jwt.sign({
                    _id: userData._id,
                }, 'secret123', { expiresIn: '30d' })
                return res.status(200).json({ ...userData, token })

            } else {
                next()
            }
        } else {
            return res.status(401).json({ message: 'Неверный код' })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error?.message ? error.message : error })
    }
}



const generateIndex = (min, max) => {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

const generateCode = () => {
    return `${generateIndex(0, 9)}${generateIndex(0, 9)}${generateIndex(0, 9)}${generateIndex(0, 9)}${generateIndex(0, 9)}${generateIndex(0, 9)}`
}








function debug(obj = {}) {
    // console.log(obj)
    return JSON.stringify(obj, null, 4);
}
