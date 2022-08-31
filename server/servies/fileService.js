const fs= require('fs')
const config= require('config')
const { File } = require('../models/File')
class FileService {

createDir(file){
        const filePath= ( file.path ? 
             `${config.get('filePath')}\\${file.userId}\\${file.path}`
              :
             `${config.get('filePath')}\\${file.userId}`
            )
    return new Promise(((resolve, reject)=>{
        try{
            if(!fs.existsSync(filePath)){
                    fs.mkdirSync(filePath)
                    return resolve({message:'file was created'})
                }
                else{
                    file.destroy()
                    return reject({message:"file already exist"})
                }
           }catch(e){
              file.destroy()
              return reject({message:'File error'})
        }
    }))
}
    // deleteFile(file){
    //     const path= this.getPath(file)
    //     if(file.type === 'dir'){
    //         const countChildFile= await File.count({where:{parent: file.id}}).then((data)=>fs.unlinkSync(getPath(data)))
    //         if(!countChildFile){
    //             fs.rmdirSync(path)
    //         }
    //         const components = []
    //         for(let i = 0; i < countChildFile; i++) {
    //             await File.destroy({where:{parent: file.id}}).then((data)=>fs.unlinkSync(getPath(data)))
    //         }
            
    //     }else{
            
    //         fs.unlinkSync(path)
    //     }
    // }
    //         deleteFolder(path);
    getPath(file){
        return config.get('filePath') + '\\' + file.userId + '\\' + file.path
    }

    deleteFile(path) {
        console.log('1')
        let files = [];
        async function fun(path){
        console.log('2')
        if( fs.existsSync(path)) {
        console.log('3')
        files = fs.readdirSync(path);
        console.log('4')
        files.forEach(async function(name){
        console.log('5')
            let curPath = path + "\\" + name;
        console.log('6')
            if(fs.statSync(curPath).isDirectory()) {
        console.log('7')
                 await fun(curPath);
        console.log('8')
            } else {
        console.log('9')
                const file= await File.findOne({where:{name}})
        console.log('10')
                fs.unlinkSync(curPath);
        console.log('11')
                file.destroy()
        console.log('12')
                file.save()
        console.log('13')
            }
        });
        fs.rmdirSync(path);
        console.log('14')
        const file=await File.findOne({where:{path}})
        console.log('15')
        file.destroy()
        console.log('16')
        file.save()
    }
}
}
}

module.exports= new FileService()