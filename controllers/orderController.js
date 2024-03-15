import axios from 'axios'
import UserModel from '../models/User.js'
const token = '6669205103:AAE24RYRkDOPbZ46ygWV6CoZENfXBIiAQi8'
const chat_id = '-1002066903328'
const uri = `https://api.telegram.org/bot${token}/sendMessage`
export const requestNewOrder = async (req, res) => {
    try {
        const basket = req.body.basket
        const comment = req.body.comment
        const user = await UserModel.findById(req.userId)
``
        if (!user) {
            return res.sendStatus(404).json({
                message: 'Пользователь не найден'
            })
        }

        let totalCost = 0
        let message = `<b>Заказ с сайта!!!</b>\n`
        message += `<b>Клиент: </b>${user._doc.name}\n`
        message += `<a href="tel:${user._doc.phoneNumber}">Номер телефона: </a>${user._doc.phoneNumber}\n`
        // message += `<b>Номер телефона: </b>${user._doc.phoneNumber}\n`
        message += `<b>Статус клиента: </b>${user._doc.role}\n`
        message += `<b>Заказ</b>\n`
        basket.map((product, index) => {
            message += `${product.name}: ${product.amount} * ${product.price}\n`
            const price = +product.price.split(' ').join('')
            const amount = product.amount
            totalCost += amount * price
            if (index === basket.length - 1) {
                let temp = String(totalCost).split('')
                let str = []
                temp = temp.reverse()
                temp.map((item, index) => {
                    if (index === 2 || index === 5 || index === 8) {
                        str.push(item)
                        str.push(' ')
                    } else {
                        str.push(item)
                    }
                })
                str = str.reverse().join('')
                totalCost = str
                message += `<b>Итого: </b> ${totalCost}\n`
                comment !== '' ? message += `<b>Комментария от клиента: </b> ${comment}\n` :null
            }
        })
        const request = await axios.post(uri, {
            chat_id: chat_id,
            parse_mode: 'html',
            text: message,
        })
        if (request.status === 200) {
            res.json(request.data)
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}
