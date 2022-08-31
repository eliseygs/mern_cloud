const sequelize= require('../db')
const {DataTypes} = require('sequelize')
const { User } = require('./User')

const File = sequelize.define('file',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    name:{type: DataTypes.STRING, required:true},
    type:{type: DataTypes.STRING, required:true},
    date:{type: DataTypes.DATE, defaultValue: Date.now()},
    accessLink:{type: DataTypes.STRING},
    size:{type: DataTypes.INTEGER, defaultValue:0},
    //childs:{type: SEQUELIZE.ARRAY(SEQUELIZE.INTEGER)},
    //         set: function(val) {
    //         return this.setDataValue('childs', parseInt(val));
    //     }
    // }
    // },
    path:{type: DataTypes.STRING, defaultValue :''},
},
)
User.hasMany(File)
File.belongsTo(User)
File.hasMany(File, {foreignKey:'parent'})
module.exports = {
    File
}