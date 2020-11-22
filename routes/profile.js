const { Router } = require('express')
const authCheck = require('../middleware/auth')
const postsSchema = require('../models/posts')
const User = require('../models/user')
const router = Router()


router.get('/', authCheck, async (req, res) => {
    const user = await User.findById(req.session.user._id)

    res.render('profile', {
        isProfile: true,
        title: 'Профиль',
        data: user ? {
            userImg: user.img,
            userName: user.name
        } : {
            userImg: req.session.user.img,
            userName: req.session.user.name
        }
    })
})

router.post('/change', authCheck, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id)
        const rightPosts = await postsSchema.find({userId: req.session.user._id})

        if (req.file) {
            rightPosts.forEach(post => post.userAva = req.file.path)
            // rightPosts.userAva = req.file.path
            user.img = req.file.path
        }
        
        for (let i = 0; i < rightPosts.length; i++) {
            await rightPosts[i].save(rightPosts[i])
        }

        await user.save()
        res.redirect('/profile')

    } catch (error) {
        console.log(error)
    }
})

module.exports = router