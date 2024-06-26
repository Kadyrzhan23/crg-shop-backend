const { body } = require('express-validator')

const registerValidator = [
    body('name','Имя минимум 3 символа').isLength({min:3}).isString(),
    body('email','Неверный формат почты').optional().isEmail(),
    body('phoneNumber','неправильный формат номера телефона').isMobilePhone(),
    body('role').optional().isString(),
    body('address','Адресс поместите в массив').isArray(),
    body('telegram','Некорректная ссылка на телеграм').optional().isString(),
    body('avatarUrl','Некорректная ссылка на аватарку').optional(),
]


const loginValidator = [
    body('phoneNumber','неправильный формат номера телефона').isMobilePhone(),
]

module.exports =  {
    loginValidator,
    registerValidator
}