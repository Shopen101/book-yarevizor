const {Router} = require('express')
const authCheck = require('../middleware/auth')
const {textAreaValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')
const postsSchema = require('../models/posts')
const router = Router()


router.get('/', async (req, res) => {
    const posts = await postsSchema.find()

    res.render('main', {
        title: 'Голос твоего города!',
        isMain: true,
        items: posts ? posts : null
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth')
    })
})


module.exports = router