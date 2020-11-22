const { Router } = require('express')
const authCheck = require('../middleware/auth')
const Posts = require('../models/posts')
const User = require('../models/user')
const router = Router()


router.get('/', authCheck, (req, res) => {
    res.render('create', {
        title: 'Создание нового поста',
        isCreate: true
    })
})

router.post('/', authCheck, async (req, res) => {
    try {

        const user = await User.findById(req.session.user._id)

        const { title, smalltxt, fulltxt } = req.body
        const post = new Posts({
            postTitle: title,
            smallTxt: smalltxt,
            fullTxt: fulltxt,
            img: req.file.path,
            userName: req.session.user.name,
            userId: req.session.user._id,
            userAva: user.img
        })


        await post.save()
        res.redirect('/')

    } catch (error) {
        console.log(error)
    }
})

module.exports = router