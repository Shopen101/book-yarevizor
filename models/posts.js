const {Schema, model } = require('mongoose')

const userSchema = new Schema({
    img: {
        type: String,
        default: null,
        required: true
    },
    smallTxt: {
        type: String,
        default: null,
        required: true
    },
    fullTxt: {
        type: String,
        default: null,
        required: true
    },
    postTitle: {
        type: String,
        default: null,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    like: {
        type: Number,
        default: 0
    },
    userAva: {
        type: String,
        required: false,
        default: null
    },
    
    likeUsers: {
        items: [{
            userId: {
                type: String
            }
        }]
    }
})


module.exports = model('Posts', userSchema)