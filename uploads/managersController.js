import ManagerModel from '../models/Manager.js'
import UserModel from '../models/User.js'

export const getManagers = async (req, res) => {
    try {
        const managers = await ManagerModel.find()
        if (managers === null) return res.status(404).json({ message: 'Что-то пошло не так' })
        if (req.userInfo.role === 'user' || req.userInfo.role === 'superUser' || !req.userInfo.role) return res.status(404).json({ message: 'У вас нет прав для получения данной инфо' })
        res.status(200).json(managers)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Что-то пошло не так', error })
    }
}

export const create = async (req, res) => {
    try {
        const { id, name, chat_id } = req.body
        const doc = new ManagerModel({
            id, name, chat_id
        })
        const manager = await doc.save()
        res.status(200).json(manager)
    } catch (error) {
        res.status(500).json({ message: 'что-то пошло не так' })
    }
}

export const changeManagerUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.body.id })
        const manager = await ManagerModel.findOne({ name: req.body.manager })
        if (user === null) return res.status(403).json({ message: 'Пользователь не найден' })
        if (manager === null) return res.status(401).json({ message: 'Ошибка при поиске менеджера в базе' })
        await UserModel.findByIdAndUpdate({ _id: req.body.id }, {
            manager: manager
        })

        res.status(200).json({ success: true })
    } catch (error) {
        res.status(500).json({ message: error?.message ? error.message : error })
    }
}