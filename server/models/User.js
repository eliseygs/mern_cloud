const sequelize= require('../db')
const {DataTypes, Sequelize} = require('sequelize')

const User = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    email:{type: DataTypes.STRING, required:true ,unique:true},
    password:{type: DataTypes.STRING, required:true},
    diskSpace:{type: DataTypes.BIGINT, defaultValue:1024**3*10},
    usedSpace:{type: DataTypes.INTEGER, defaultValue:0},
    avatar:{type: DataTypes.STRING },
},
)
module.exports = {
    User
}