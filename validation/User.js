import { body } from 'express-validator'

export const registerValidator = [
    body('name','Имя минимум 3 символа').isLength({min:3}).isString(),
    body('email','Неверный фотрмат почты').isEmail(),
    body('phoneNumber','неправильный формат номера телефона').isMobilePhone(),
    body('password','Пароль должен быть минимум 6 символов').isLength({min:6}),
    body('role','').optional().isString(),
    body('address','Адресс поместите в массив').isArray(),
    body('telegram','Некорректная ссылка на телеграм').optional().isString(),
    body('avatarUrl','Некорректная ссылка на аватарку').optional(),
]

export const loginValidator = [
    body('email','Неверный фотрмат почты').isEmail(),
    body('password','Пароль должен быть минимум 6 символов').isLength({min:6})
]