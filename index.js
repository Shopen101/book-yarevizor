const express = require('express')
const exphbs = require('express-handlebars') //подключаю handlebars в проект
const registerRoutes = require('./routes/register')
const mainRoutes = require('./routes/main')
const createRoutes = require('./routes/create')
const profileRoutes = require('./routes/profile')
const path = require('path')
const compression = require('compression')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const keys = require('./keys')
const flash = require('connect-flash')
const fileMiddleware = require('./middleware/file')
const post = require('./routes/post')

const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)    
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'img')))
app.use(express.urlencoded({
    extended: true
}))

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('photopost'))

//роуты
app.use(varMiddleware)
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(flash())
app.use('/', mainRoutes)
app.use(registerRoutes)
app.use('/create', createRoutes)
app.use('/profile', profileRoutes)
app.use('/', post)

const PORT = process.env.PORT || 3000 

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()