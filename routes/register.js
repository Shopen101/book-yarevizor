const {Router} = require('express')
const {validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')
const {authValidators} = require('../utils/validators')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = Router()


router.get('/auth', (req, res) => {
    res.render('auth', {
        title: 'Авторизация',
        isAuthUser: true,
        loginError: req.flash('registerError')
    })
})


router.post('/reg', registerValidators, async (req, res) => {
    try {
        const { email, password, name } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).render('auth', {
                title: 'Авторизация',
                loginError: req.flash('registerError'),
                isAuthUser: true,
                data: {
                    name: req.body.name,
                    email: req.body.email
                }
            })
        }

        const hashPassoword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            name,
            password: hashPassoword
        })

        await user.save()
        

        req.session.user = user
        req.session.isAuthenticated = true
        req.session.save(err => {
            if (err) {
                throw err
            }
            res.redirect('/')
        })

    } catch (error) {
        console.log(error)
    }
})


router.post('/auth', authValidators, async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            
            const areSame = await bcrypt.compare(password, candidate.password)            
            
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.render('auth', {
                    title: 'Авторизация',
                    isAuthUser: true,
                    loginErrori: req.flash('loginError'),
                    data: {
                        emaili: req.body.email
                    }
                })
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.render('auth', {
                title: 'Авторизация',
                isAuthUser: true,
                loginError: req.flash('loginError'),
                data: {
                    email: req.body.email
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
})


module.exports = router