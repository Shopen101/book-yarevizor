const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('name', 'Имя должно быть не менее 3 и не более 16 символов')
    .isLength({min: 3, max: 16})
    .trim(),

    body('email')
    .isEmail().withMessage('Введите корректный email')
    .custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.reject('Такой email уже занят ')
            }
        } catch (error) {
            console.log(error)
        }
    })
    .normalizeEmail(),

    body('password', 'Пароль должен быть минимум 8 символов!')
        .isLength({min: 8, max: 56})
        .isAlphanumeric()
        .trim(),

    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }

        return true 
    }).trim()
]



exports.authValidators = [

    body('email')
    .isEmail().withMessage('Введите корректный email')
    .custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.reject('Такой email уже занят ')
            }
        } catch (error) {
            console.log(error)
        }
    })
    .normalizeEmail(),

    body('password', 'Пароль должен быть минимум 8 символов!')
        .isLength({min: 8, max: 56})
        .isAlphanumeric()
        .trim()
]

exports.textAreaValidators = [
    body('textik', 'Поле не должно быть пустым!')
        .isLength({min: 1})
]