const jwt= require('jsonwebtoken')
const config= require('config')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS')
    { 
        return next()
    }

    try{
        const token=req.headers.authorization.split('Bearer ')[1]
        if(!token)
        {
            return res.status(401).json({message:'Auth error'})
        }
        const decoded= jwt.verify(token, config.get('SECRET_KEY'))

                console.log('----------------------------------------------------------------------------------------')
        console.log(decoded)
                console.log('----------------------------------------------------------------------------------------')
        req.user= decoded
        next()
    }catch(e){
        console.log(e)
        return res.status(401).json({message:"Auth error"})
    }
}