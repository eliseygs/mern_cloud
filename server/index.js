const sequelize= require('./db')
const config= require('config')
const fileUpload= require('express-fileUpload')
const express= require('express')
const cors = require('cors')
const User = require('./models/User')
const File = require('./models/File')
const userRouter= require('./routes/auth.routes')
const fileRouter= require('./routes/file.routes')
//const mongoose= require('mongoose')
//const corsMiddleware= require('./middleware/cors.middleware')
const PORT= config.get('PORT')
const app= express()
//app.use(corsMiddleware)
app.use(fileUpload({}))
app.use(cors())
app.use(express.json())
app.use(express.static('static'))

app.use('/api/auth', userRouter)
app.use('/api/files', fileRouter)



const start = async () => {
    try{
        await sequelize.authenticate() 
        await sequelize.sync()//{force:true})
        //mongoose.connect()
        app.listen(PORT, () => {console.log('Server started on port', PORT)})
    }
    catch(e){
        console.log(e)
    }
}
start()