import { body } from 'express-validator';

export const createPostValidation = [
    body('name','Имя должен быть уникальным минимум 3 символа').isLength({min:3}).isString(),
    body('description','В запросе отсутствует описания или не соответствует требованием (минимум 15 символов)').isLength({min:15}).isString(),
    body('priceUser','Цена для простых пользователей отсутсвует или не соответствует требованием. Цены отправте в массиве').isArray(),
    body('priceWS','Цена для оптовых пользователей отсутсвует или не соответствует требованием. Цены отправте в массиве').isArray(),
    body('img','Что то не так с картинкой').isString(),
    body('type','Что то не так с (type)').isString(),
    body('sort','Что то не так с (sort)').isString(),
    body('region','Что то не так с (region)').isString(),
    body('weight','Что то не так с (weight) или не соответствует требованием. Вес упаковок отправте в массиве').isArray(),
    body('descriptors','Что то не так с (descriptors)').isString(),
    body('scaScore','Что то не так с (scaScore)').isString(),
    body('roast','Что то не так с (roast)').isString(),
    body('scores','Что то не так с (scores)').isString(),
    body('density','Что то не так с (density)').isNumeric(),
    body('density','Что то не так с (density)').isNumeric(),
    body('forWhat','Что то не так с (forWhat)').isString(),
    body('treatment','Что то не так с (treatment)').isString(),
]

