const {Router} = require('express')
const postsSchema = require('../models/posts')
const router = Router()

router.get('/:id', async (req, res) => {
    const post = await postsSchema.findOne({ _id: req.params.id })

    res.render('post', {
        title: 'Голос твоего города!',
        isPost: true,
        items: post
    })
})

module.exports = router