const  Router = require('express')
const bcrypt =require('bcrypt')
const {User} = require('../models/User')
const {check, validationResult}= require('express-validator')
const jwt =require('jsonwebtoken')
const config= require('config')
const authMiddleware= require('../middleware/auth.middleware')
const router = new Router()
const fileService= require('../servies/fileService')
const {File}= require('../models/File')
 
router.post('/registration',
        [
            check('email', "Uncorrect email").isEmail(),
            check('password','password must be longer than 3 and shorter than 12').isLength({min:3,max:12})

        ],
        async (req, res) => {
            const errors= validationResult(req)
            if(!errors.isEmpty()){
                return res.status(404).json({message: 'bad request'})
            }
        try{
        const {email, password} = req.body

        const candidate= await User.findOne({where:{email}})
        if(candidate){
            return res.status(400).json({message: `user with email ${email} already exist`}) 
        }
        console.log('hhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeeeeeeeeeeeeelllllllllllllllllllllllllllllllllllllllllloooooooooooooooooooooooooooooooooooooooooooooooooooooo')
        const hashPassword = await bcrypt.hash(password, 5)
        const user= await User.create({email, password: hashPassword})
        await fileService.createDir(await File.create({userId: user.id, name:''}))
        const token = jwt.sign({id:user.id}, config.get("SECRET_KEY"),{expiresIn:"1h"}) 
        return res.json({token, user:{
            id: user.id,
            email: user.email,
            diskSpace:user.diskSpace,
            usedSpace:user.usedSpace,
            avatar:user.avatar 
        }})
    } catch(e){
        console.log(e)
        res.send({message:"server error"})
    }
}
)

router.post('/login',
        async (req, res) => {
             const {email, password} = req.body
             const user= await User.findOne({where:{email}})
             if(!user){
                return res.status(404).json({message:'user not found'}) 
            }
            console.log('aaaaaaaaaaaaaffffffffffffffffffffffffffffffffffff-------------------------------------------')
       let comparePassword = bcrypt.compareSync(password, user.password)
       if(!comparePassword){
           return res.json('dont true password') 
       }
       const token = jwt.sign({id:user.id}, config.get("SECRET_KEY"),{expiresIn:"1h"}) 
       return res.json({
       token,
       user:{
        id: user.id,
        email: user.email,
        diskSpace:user.diskSpace,
        usedSpace:user.usedSpace,
        avatar:user.avatar}})
})

router.get('/',authMiddleware,
        async (req, res) => {
            try{
                const user= await User.findOne({where:{id:req.user.id}})
                const token = jwt.sign({id:user.id}, config.get("SECRET_KEY"),{expiresIn:"1h"}) 
           return res.json({
           token,
           user:{
            id: user.id,
            email: user.email,
            diskSpace:user.diskSpace,
            usedSpace:user.usedSpace,
            avatar:user.avatar
            }
           }
           )

            }catch(e){
                console.log(e)
                res.send({message:'Server error'})
            }
        }
)
module.exports= router