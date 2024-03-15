import express from 'express'
import mongoose from 'mongoose'
import { registerValidator, loginValidator } from './validation/User.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/userController.js'
import * as PostController from './controllers/postController.js'
import * as OrderController from './controllers/orderController.js'
import { createPostValidation } from './validation/Post.js'
import cors from "cors";
import multer from 'multer';
import fs from 'fs'
import path from "path";
// import ('dotenv').config()

mongoose
    // .connect('mongodb+srv://zarimkofe:wwwwww@cluster0.ddu19sw.mongodb.net/blog?retryWrites=true&w=majority')
    .connect('mongodb+srv://zarimkofe:wwwwww@cluster0.ddu19sw.mongodb.net/blog?retryWrites=true&w=majority&ssl=true')

    .then(() => console.log('Db Ok'))
    .catch(err => console.log('Error connecting to Db' + err))

const app = express()

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


app.use(cors());
app.use(express.json())
app.use('/uploads', express.static('uploads'));

//Авторизация
app.post('/auth/register', registerValidator, UserController.register)
app.post('/auth/login', loginValidator, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/get/all-users', checkAuth, UserController.getAllUsers)

//Посты
app.get('/post/getAll', PostController.getAll)
app.post('/post/create', createPostValidation, PostController.create)
app.post('/post/favorites',PostController.getFavorites)

//Заказы
app.post('/new-order',checkAuth,OrderController.requestNewOrder)

// Роут для загрузки картинки
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        console.log(req.file)
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded.' });
        }

        const filePath = path.join(uploadDir,req.filename,);
        res.json({ imagePath: filePath });
    } catch (error) {
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