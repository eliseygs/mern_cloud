const fileService= require('../servies/fileService')
const config= require('config')
const {User}= require('../models/User')
const {File}= require('../models/File')
const fs= require('fs')
const { Op } = require("sequelize");
const Uuid= require('Uuid')

class FileController{
    async createDir(req, res){
         try{
             const {name, type, parent}= req.body
                let parentFile;
                if(parent){
                    parentFile= await File.findOne({where:{id:parent}}) 
                }
              const file= await File.create({name, type, parent, userId: req.user.id})
              if(!parentFile){//or !parent 
                 file.path= file.name
                 await file.save()
                 console.log('///////////ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
                 await fileService.createDir(file)
                 return res.json(file)
              }
              (parentFile ?
              file.path= `${parentFile.path}\\${file.name}`
              :
              file.path= file.name
              )
              console.log('///////////////////////////////////////////////////////////////////////////////////////////////////')
              await fileService.createDir(file)
              console.log(file.id)
              //await File.destroy({where:{parent: parentFile.id}})
              //parentFile.update('childs',file.id)
              await file.save()
              await parentFile.save()
              console.log(parentFile)
              console.log(parentFile.id)
              return res.json(file)
                 //console.log(file.path)
                 //console.log(file.name)
                 //console.log(name)
                 //file.path= file.name
                 //return res.json(file.path)
         }catch(e){
             console.log(e)
             return res.status(400).json(e)
         }
    }
     
    async getFiles(req, res){
        try{
            const {sort}= req.query
            let files;
            switch (sort){
                case 'name':
                    files= await File.findAll({where:{userId: req.user.id, parent: req.query.parent? req.query.parent :null }, order:['name']})
                    break
                case 'type':
                    files= await File.findAll({where:{userId: req.user.id, parent: req.query.parent? req.query.parent :null }, order:['type']})
                    break
                case 'date':
                    files= await File.findAll({where:{userId: req.user.id, parent:req.query.parent ? req.query.parent :null }, order:['date']})
                    break
                default:
                    files= await File.findAll({where:{userId: req.user.id, parent:req.query.parent ? req.query.parent :null }})
                    break
            }
            // if(!req.user.id && !parent ){
            //     files= await File.findAll({where:{parent:null}})
            // }
            // if(req.user.id && !parent){
            //     files= await File.findAll({where:{userId: req.user.id, parent:null}})
            // }
            // if(!req.user.id && parent){
            //     files= await File.findAll({where:{parent: parent}})
            // }
            // if(req.user.id&& parent ){
            //     files= await File.findAll({where:{userId: req.user.id, parent:parent}})
            // }
            return res.json(files)
        }catch(e){
            console.log(e)
            return res.status(500).json({message:"Can not get files"})
        }

    }

    async postFile(req, res){
        try{
            const {parent}= req.body
            let parentFile;
            if(parent){
                parentFile= await File.findOne({where:{id:parent}})
            }
            const user= await User.findOne({where:{id: req.user.id}})//from login from user

            if(user.usedSpace + req.files.file.size > user.diskSpace){
                return res.status(400).json({message:'there no space on the disk'})
            }
            user.usedSpace= user.usedSpace + req.files.file.size

            let path;
            if(parentFile){
                path= `${config.get('filePath')}\\${user.id}\\${parentFile.path}\\${req.files.file.name}`
            }else{
                path= `${config.get('filePath')}\\${user.id}\\${req.files.file.name}`
            }
            if(fs.existsSync(path)){
                return res.status(400).json({message:"file already exist"})
            }
             await req.files.file.mv(path)
             const type= req.files.file.name.split('.').pop()
             let filePath;
             if(parentFile){
              filePath= parentFile.path + '\\' + req.files.file.name
             }else{
              filePath= req.files.file.name
             }

             const dbFile= await File.create({
                 name:req.files.file.name,
                 type,
                 size: req.files.file.size,
                 path:filePath,
                 parent:parentFile?.id,
                 userId:user.id
             })
             if(parentFile){
                 parentFile.childs.push(dbFile.id)
                 await parentFile.save()
             }
        return res.json(dbFile)

        }catch(e){
            console.log(e)
            return res.status(500).json({message:'post error'})
        }

    }
    async downloadFile(req, res){
        try{
            console.log('c')
            const file= await File.findOne({where:{id:req.query.id, userId: req.user.id}})
            console.log('d')

            const path= `${config.get('filePath')}\\${req.user.id}\\${file.path}`
            console.log(path)
            if(fs.existsSync(path)){
            console.log('f')
                return res.download(path, file.name)
            }
            console.log('g')
            return res.status(400).json({message:"Download error"})
        } catch(e){
            console.log(e)
            console.log('h')
            res.status(500).json({message:"Download error"})
        }
    }

    async deleteFile(req, res){
        try{
            console.log('a')
            const file= await File.findOne({where:{id:req.query.id, userId:req.user.id}})
            console.log('b')
            console.log(file)
            console.log('c')
            if(!file){
            console.log('d')
                return res.status(400).json({message:'file not found'})
            }
            console.log('e')
            fileService.deleteFile(config.get('filePath') + '\\' + file.userId + '\\' + file.path)
            //await file.destroy()
            console.log('f')
            return res.status(200).json({message:'File was deleted'})
        }catch(e){
            console.log('g')
            console.log(e)
            return res.status(400).json({message:'dir is not empty'})
        }
    }
     
        async searchFile(req, res){
            try{
                const searchName= req.query.search 
                let files= await File.findAll({where:{userId:req.user.id}})
                files= files.filter(file=>file.name.includes(searchName))
                console.log('1')
                return res.json(files)
            }catch(e){
                console.log(e)
                return res.status(400).json({message:'search error'})
            }
        }

        async postAvatar(req, res){
            try{
                const file= req.files.file
                const user= await User.findByPk(req.user.id)
                const type= req.files.file.name.split('.').pop()
                const avatarName= Uuid.v4() + `.${type}`
                file.mv(config.get('staticPath')+'\\'+ avatarName)
                user.avatar= avatarName
                await user.save()
                return res.json(user)
            }catch(e){
                console.log(e)
                return res.status(400).json({message:'upload avatar error'})
            }
        }
        
        async deleteAvatar(req, res){
            try{
                const user= await User.findByPk(req.user.id)
                fs.unlinkSync(config.get('staticPath')+'\\'+ user.avatar)
                user.avatar= null
                await user.save()
                return res.json(user)
            }catch(e){
                console.log(e)
                return res.status(400).json({message:'delete avatar error'})
            }
        }
}
module.exports= new FileController()