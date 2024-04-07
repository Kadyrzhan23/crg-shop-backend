import express from 'express'
import mongoose from 'mongoose'
import { registerValidator, loginValidator } from './validation/User.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/userController.js'
import * as PostController from './controllers/postController.js'
import * as OrderController from './controllers/orderController.js'
import { createPostValidation, createPostTeaValidation, createPostOtherValidation } from './validation/Post.js'
import cors from "cors";
import multer from 'multer';
import fs from 'fs'
import path from "path";
import checkAuthAdmin from './utils/checkAuthAdmin.js'
import { sendMessage } from './controllers/tgMessageController.js'

mongoose
    .connect('mongodb+srv://zarimkofe:wwwwww@cluster0.ddu19sw.mongodb.net/blog?retryWrites=true&w=majority')
    // .connect('mongodb+srv://zarimkofe:wwwwww@cluster0.ddu19sw.mongodb.net/blog?retryWrites=true&w=majority&ssl=true')
    .then(() => console.log('Db Ok'))
    .catch(err => {
        sendMessage(err.message)
        console.log('Error connecting to Db' + err)
    })

const app = express()

app.use(cors());

//Загрузка фото для верификации
const uploadDir = './uploads'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Создаем хранилище для Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        req.filename = filename;
        cb(null, filename);
    },
});

// Инициализируем объект Multer
const upload = multer({ storage });


app.use(express.json())
app.use('/uploads', express.static('uploads'));

//Авторизация
app.post('/auth/register', registerValidator, UserController.register)
app.post('/auth/login', loginValidator, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

//Посты
app.get('/post/getAll', PostController.getAll)
app.post('/post/create/coffe', checkAuthAdmin, createPostValidation, PostController.createCoffe)
app.post('/post/create/tea', checkAuthAdmin, createPostTeaValidation, PostController.createPostTea)
app.post('/post/create/other', checkAuthAdmin, createPostOtherValidation, PostController.createPostOtherProducts)
app.post('/post/favorites', PostController.getFavorites)

//Заказы
app.post('/new-order', checkAuth, OrderController.create, OrderController.sendMessageTg)
app.get('/get-my-orders', checkAuth, OrderController.getMyOrders)

//Запросы с требованием админских прав
app.post('/get/all-users', checkAuthAdmin, UserController.getAllUsers)
app.patch('/user/level-up', checkAuthAdmin, UserController.userLevelUp)
app.get('/get-all-orders', checkAuthAdmin, OrderController.getAllOrders)
app.patch('/order', checkAuthAdmin, OrderController.updateStatus)
app.patch('/order/product', checkAuthAdmin, OrderController.deleteProductFromOrder)
app.patch('/order/product/amount', checkAuthAdmin, OrderController.updateProductAmountInOrder)



// Роут для загрузки картинки
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        console.log(req.file)
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded.' });
        }

        const filePath = path.join(uploadDir, req.filename,);
        res.json({ imagePath: filePath });
    } catch (error) {
        sendMessage(error)
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server Ok')
})