import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import { registerValidator, loginValidator } from './validation/User.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/userController.js'
import * as PostController from './controllers/postController.js'
import * as OrderController from './controllers/orderController.js'
import * as ManagerController from './controllers/managersController.js'
import * as SendCode from './controllers/sendCode.js'
import { createPostValidation, createPostTeaValidation, createPostOtherValidation } from './validation/Post.js'
import cors from "cors";
import multer from 'multer';
import fs from 'fs'
import path from "path";
import checkAuthAdmin from './utils/checkAuthAdmin.js'
import { sendMessage } from './controllers/tgMessageController.js'
import Manager from './models/Manager.js'
import https from 'https'
const privkey = fs.readFileSync('./privkey.pem')
const certkey = fs.readFileSync('./cert.pem')

mongoose
    .connect(process.env.MONGO_DB_URL)
    // .connect('mongodb+srv://zarimkofe:wwwwww@cluster0.ddu19sw.mongodb.net/blog?retryWrites=true&w=majority&ssl=true')
    // .connect('mongodb+srv://zarimkofe:wwwwww@cluster0.ddu19sw.mongodb.net/deploy?retryWrites=true&w=majority&ssl=true')
    .then(() => {
        // sendMessage('Db connect')
        console.log('Db Ok')
    })
    .catch(err => {
        sendMessage(err.message)
        console.log('Error connecting to Db' + err)
    })

const app = express()

app.use(cors());
const sslServer  = https.createServer ({
key: privkey,
cert: certkey,
}, app);

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
app.post('/register', registerValidator, UserController.register)
app.post('/register-verify',UserController.verifyRegister)
app.post('/login', loginValidator, UserController.login)
app.get('/me', checkAuth, UserController.getMe)
app.patch('/update-user-data', checkAuth, UserController.update)
// app.post('/send-code', SendCode.updateUserCode)
app.patch('/block-user', checkAuthAdmin, UserController.block)
app.patch('/unlock-user', checkAuthAdmin, UserController.unlock)
app.patch('/add-destination-point',checkAuth,UserController.addDestinationPoint)

//Посты
app.get('/post/getAll', PostController.getAll)
app.post('/post/create/coffe', checkAuthAdmin, createPostValidation, PostController.createCoffe)
app.post('/post/create/tea', checkAuthAdmin, createPostTeaValidation, PostController.createPostTea)
app.post('/post/create/other', checkAuthAdmin, createPostOtherValidation, PostController.createPostOtherProducts)
app.post('/post/favorites', PostController.getFavorites)
app.post('/post', checkAuthAdmin, PostController.deletePost)
app.patch('/post/add-in-top', checkAuthAdmin, PostController.addInTop)
app.patch('/post/delete-from-top', checkAuthAdmin, PostController.deleteFromTop)
app.patch('/post/add-in-stop', checkAuthAdmin, PostController.addInStop)
app.patch('/post/delete-from-stop', checkAuthAdmin, PostController.deleteFromStop)



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
app.get('/user/:id', checkAuthAdmin, UserController.getUserInfo)
app.get('/user-orders/:userId', checkAuthAdmin, OrderController.getUserOrders)
app.patch('/block-user', checkAuthAdmin, UserController.block)
app.patch('/unlock-user', checkAuthAdmin, UserController.unlock)
app.post('/managers/create',checkAuthAdmin , ManagerController.create)
app.get('/managers',checkAuthAdmin , ManagerController.getManagers)
app.post('/change-manager',checkAuthAdmin , ManagerController.changeManagerUser)




//Разработка
app.post('/send-code', SendCode.sendCode)
app.post('/verify-code', SendCode.verifyCode,UserController.register)



app.get('/get-all-managers', async (req, res) => {
    const response = await Manager.find()
    res.json(response)
})






// Роут для загрузки картинки
app.post('/upload', upload.single('image'), (req, res) => {
    try {
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

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server Ok')
})