const mongoose = require('mongoose')
const Schema = mongoose.Schema

const salesSchema = new Schema({
    productId :{
        type: Schema.Types.ObjectId, ref: 'Products'
    },
    userId :{
        type: Schema.Types.ObjectId, ref: 'User'
    },   
    
    total : {
        type : Number,        
    },
    qry : {
        type : Number,        
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

const Sales = mongoose.model('Sales',salesSchema)
module.exports = Sales