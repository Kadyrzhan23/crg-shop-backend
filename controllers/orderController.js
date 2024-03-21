import axios from 'axios'
import UserModel from '../models/User.js'
import OrderModel from '../models/Order.js'
const token = '6669205103:AAE24RYRkDOPbZ46ygWV6CoZENfXBIiAQi8'
const chat_id = '-1002066903328'
const uri = `https://api.telegram.org/bot${token}/sendMessage`
export const sendMessage = async (req, res) => {
    try {
        const basket = req.order.listProducts
        console.log(req.userId)
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.sendStatus(404).json({
                message: 'Нет доступа'
            })
        }

        let totalCost = 0
        let message = `<b>Заказ с сайта!!!</b>\n`
        message += `<b>Клиент: </b>${user._doc.name}\n`
        message += `<a href="tel:${user._doc.phoneNumber}">Номер телефона: </a>${user._doc.phoneNumber}\n`
        message += `<b>Id заказа: </b>${req.order.id}\n`
        message += `<b>Статус клиента: </b>${user._doc.role}\n`
        message += `<b>Заказ:</b>\n`
        basket.map((product, index) => {
            message += `${product.name} (<i>${product.weight}</i>) под ${product.roast}: ${product.amount} * ${product.price}\n`
            const price = +product.price.split(' ').join('')
            const amount = product.amount
            totalCost += amount * price
            if (index === basket.length - 1) {
                message += `<b>Итого: </b> ${req.body.totalCost}\n`
                req.order.comment !== '' ? message += `<b>Комментария от клиента: </b> ${req.order.comment}\n` : null
            }
        })
        const request = await axios.post(uri, {
            chat_id: chat_id,
            parse_mode: 'html',
            text: message,
        })
        if (request.status === 200) {
            res.status(200).json({ message: "Заказ успешно создался" })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}


export const create = async (req, res, next) => {
    try {
        const basket = req.body.basket
        const comment = req.body.comment
        const doc = new OrderModel({
            userId: req.userId,
            listProducts: basket,
            creationDate: Date.now(),
            comment: req.body.comment,
            totalPrice: req.body.totalPrice
        })
        console.log(Date.now());
        const order = await doc.save()
        req.order = order
        next()
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создание заказа' })
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await OrderModel.find({ userId: userId })

        res.status(200).json(orders)
    } catch (error) {
        res.status(404).json({ message: 'Ошибка на стороне сервера' })
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user || user.role !== 'admin') {
            return res.sendStatus(404).json({
                message: 'Нет доступа'
            })
        }

        const allOrders = await OrderModel.find()
        if(!allOrders){
            return res.status(400).json({
                message:'Не удалось получить всех заказов'
            })
        }

        res.status(200).json(allOrders)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

export const updateStatus = async (req, res) => {
    try {
        const orderId = req.body.orderId
        const nextStatus = req.body.nextStatus
        await OrderModel.findByIdAndUpdate({ _id: orderId },
            {
                status: nextStatus
            })
            
        res.status(200).json({ success: true })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
