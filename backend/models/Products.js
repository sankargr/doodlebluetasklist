const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productsSchema = new Schema({
    name :{
        type :String
    },
    price :{
        type :String
    },
    desc:{
        type :String
    },
    imgPath : {
        type : String,        
    },
    status : {
        type : Number,
        default :1
    },
    createdAt:{
        type :Date,
        default :new Date()
    },
    updatedAt:{
        type :Date,
        default :new Date()
    }
})

const Products = mongoose.model('Products',productsSchema)
module.exports = Products