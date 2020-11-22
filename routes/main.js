const {Router} = require('express')
const authCheck = require('../middleware/auth')
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

router.post('/like:id', async (req, res) => {
    const postId = req.params.id

    const rightPost = await postsSchema.findById(postId)
    rightPost.like = ++rightPost.like

    await rightPost.save()
})


module.exports = router