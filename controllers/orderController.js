import axios from 'axios'
import UserModel from '../models/User.js'
import OrderModel from '../models/Order.js'
const token = '6669205103:AAE24RYRkDOPbZ46ygWV6CoZENfXBIiAQi8'
const chat_id = `-1002085755553`
const chat_id_users = '-1002066903328'
const chat_id_super = `-1002112440272`
const uri = `https://api.telegram.org/bot${token}/sendMessage`
export const sendMessageTg = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.sendStatus(404).json({
                message: 'Нет доступа'
            })
        }

        const options = {
            basket: req.order.listProducts,
            user,
            order: req.order,
            paymentMethod: req.body.paymentMethod,
            totalPrice: req.body.totalPrice
        }
        const message = await generateOrderText(options)
        const request = await axios.post(uri, {
            chat_id: user.role === 'superUser' ? chat_id_super : chat_id_users,
            parse_mode: 'html',
            text: message,
        })
        if (request.status === 200) {
            await OrderModel.findByIdAndUpdate({ _id: req.order.id }, {
                telegram: {
                    storehouse: {
                        message_id: request.data.result.message_id,
                    }
                }
            })
            res.status(200).json({
                message: "Заказ успешно создался",
                data: request.data.result
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

export const create = async (req, res, next) => {
    try {
        const basket = req.body.basket
        const doc = new OrderModel({
            userId: req.userId,
            listProducts: basket,
            creationDate: getDate(),
            comment: req.body.comment,
            totalPrice: req.body.totalPrice,
            paymentMethod: req.body.paymentMethod
        })

        const order = await doc.save()
        req.order = order
        next()
    } catch (error) {

        res.status(500).json({
            message: 'Ошибка при создание заказа',
            doc: error.message
        })
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
        if (!allOrders) {
            return res.status(400).json({
                message: 'Не удалось получить всех заказов'
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
        const order = await OrderModel.findById({ _id: orderId })
        const user = await UserModel.findById(order.userId)
        if (!user || user === null) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }
        const options = {
            basket: order.listProducts,
            user,
            order: order,
            paymentMethod: order.paymentMethod,
            totalPrice: order.totalPrice
        }
        const message = await generateOrderText(options)
        nextStatus === 'Оформлен' ? await axios.post(uri, {
            chat_id: chat_id,
            parse_mode: 'html',
            text: message,
        }) : null


        res.status(200).json({ success: true })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};

export const updateProductAmountInOrder = async (req, res) => {
    try {
        let currentProduct = {};
        const order = await OrderModel.findById(req.body.orderId)
        if (order.status !== 'В ожидании') {
            return res.status(400).json({ message: 'Заказ можно мзменить только в состоянии Ожидания' })
        }
        const listProducts = order.listProducts
        listProducts.forEach(product => {
            if (product.id === req.body.productId) {
                if (product.amount === req.body.currentAmount) {
                    Object.assign(currentProduct, product)
                    product.amount = req.body.nextAmount
                    req.productWeight = product.weight
                }
            }
        })

        if (!currentProduct.amount) {
            return res.status(400).json({ message: 'Заказ можно мзменить только в состоянии Ожидания' })
        }

        if (0 < req.body.currentAmount - req.body.nextAmount) {
            currentProduct.amount = req.body.currentAmount - req.body.nextAmount
            currentProduct.comment = req.body.comment
            currentProduct.changedBy = {
                userId: req.userId,
                userName: req.userName,
                updated: getDate(),
                status: req.userStatus
            }
        }

        let rejectedList = order.rejectedList
        let productBool = false
        let productIndex = null
        rejectedList.forEach((product, index) => {
            if (product.id === req.body.productId) {
                if (product.weight === req.productWeight) {
                    productBool = true
                    productIndex = index
                }
            }
        })

        if (productBool && productIndex !== null) {
            rejectedList[productIndex].amount = rejectedList[productIndex].amount + currentProduct.amount
        } else {
            // currentProduct.amount = req.body.nextAmount - req.body.currentAmount
            rejectedList.push(currentProduct)
        }
        await OrderModel.findByIdAndUpdate({ _id: req.body.orderId },
            {
                totalPrice: totalCost(listProducts),
                listProducts: listProducts,
                rejectedList: rejectedList
            })

        const order2 = await OrderModel.findById(req.body.orderId)
        res.status(200).json({ order2 })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

export const deleteProductFromOrder = async (req, res) => {
    try {
        let productIndex = null
        let currentProduct = {}
        const order = await OrderModel.findById(req.body.orderId)
        let listProducts = order.listProducts
        if (order.status !== 'В ожидании') {
            return res.status(400).json({ message: 'Заказ можно мзменить только в состоянии Ожидания' })
        }

        if (order.listProducts.length < 2) {
            return res.status(400).json({ message: 'Нельзя удалить продукт если в заказе только одна позиция' })
        }
        // console.log(listProducts[0].id,req.body.productId)
        listProducts.forEach((product, index) => {
            if (product.id === req.body.productId) {
                if (product.amount === req.body.amount) {
                    productIndex = index
                    Object.assign(currentProduct, product)
                }
            }
        })

        console.log(currentProduct)

        if (!currentProduct.amount) {
            return res.status(500).json({ message: 'Не удалось удалить продукт из заказа' })
        }
        listProducts.splice(productIndex, 1);
        let rejectedList = order.rejectedList
        let productBool = false


        rejectedList.map((product, index) => {
            console.log(product.id, currentProduct.id)
            if (product.id === currentProduct.id) {
                if (product.weight === currentProduct.weight) {
                    productBool = true
                    productIndex = index
                }
            }
        })

        console.log(productBool)
        console.log(productIndex)

        if (productBool && productIndex !== null) {
            rejectedList[productIndex].amount = rejectedList[productIndex].amount + currentProduct.amount
            rejectedList[productIndex].comment = req.body.comment
            rejectedList[productIndex].changedBy = {
                userId: req.userId,
                userName: req.userName,
                updated: getDate()
            }
        } else {
            // currentProduct.amount = req.body.nextAmount - req.body.currentAmount
            rejectedList.push(currentProduct)

        }
        await OrderModel.findByIdAndUpdate({ _id: req.body.orderId },
            {
                totalPrice: totalCost(listProducts),
                listProducts: listProducts,
                rejectedList: rejectedList,
            })
        const order2 = await OrderModel.findById(req.body.orderId)
        res.status(200).json(order2)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Не удалось удалить продукт из заказа' })
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const id = req.params.userId
        const userOrders = await OrderModel.find({ userId: id })

        if (!userOrders) {
            console.log(userOrders)
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json(userOrders)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}



function getDate() {
    const now = new Date()
    let S = now.getSeconds()
    let MN = now.getMinutes()
    let H = now.getUTCHours() + 5
    let D = now.getUTCDate()
    let M = now.getMonth()
    let Y = now.getFullYear()

    if (S < 10) S = '0' + S
    if (MN < 10) MN = '0' + MN
    if (H < 10) H = '0' + H
    if (D < 10) D = '0' + D
    if (M < 10) M = '0' + M

    return `${H}:${MN}:${S} ${D}.${M}.${Y}`
}


function totalCost(basket) {
    let total = 0
    basket.map((product) => {
        const price = +product.price.split(' ').join('')
        const amount = +product.amount
        total = total + (amount * price)
    })
    return priceAdjustment(total)
}
function priceAdjustment(val) {
    // console.log(val)
    let temp = String(val).split('')
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
    return str
}

async function orderNumber(type) {
    // const types = ['coffe-beans','tea','syrup','accessory','chemistry','coffee-capsule']

}


async function generateOrderText({ basket, user, order, paymentMethod, totalPrice }) {
    let totalCost = 0
    console.log(user)
    let message = `<b>${user._doc.role === 'superUser' ? '«««««ОПТ»»»»»' : '«««««Розница»»»»»'}</b>\n`
    message += `<b>Клиент: </b>${user._doc.name}\n`
    message += `<a href="tel:${user._doc.phoneNumber}">Номер телефона: </a>${user._doc.phoneNumber}\n`
    message += `<b>Id заказа: </b>${order.id}\n`
    message += `<b>Способ оплаты: </b>${paymentMethod}\n`
    message += `\n`
    message += `<b>«««««ЗАКАЗ»»»»»</b>\n`
    message += `\n`
    basket.map((product, index) => {
        message += `${product.name} ${product.type === 'coffe-beans' ? `(${product.roast})` : ''}\n`
        message += product.type === 'coffe-beans' ? `Вес:${product.weight}\n` : ''
        message += product.type === 'tea' ? `Упаковка:${product.package}\n` : ''
        message += `Кол-во:${product.amount}\n`
        message += product.type === 'coffe-beans' ? `Помол:${product.pomol}\n` : ''
        message += `\n`
        const price = +product.price.split(' ').join('')
        const amount = product.amount
        totalCost += amount * price
        if (index === basket.length - 1) {
            message += `<b>Итого: </b> ${totalPrice}\n`
            order.comment !== '' ? message += `<b>Комментария от клиента: </b> ${order.comment}\n` : null
        }
    })
    return message
}