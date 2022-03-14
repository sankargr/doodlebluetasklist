const mongoose = require('mongoose')
const Sales = require('../models/Sales')
const moment = require("moment-timezone");

const CommonLib = require("../components/CommonLib");
const {
    Validator
} = require('node-input-validator');

module.exports = {	
    orderlist: function (req, res) {  
        
        if (req.method == 'POST') {
            let userId =''
            if(req.user && req.user.username)
            {
                userId = req.user.username
            }                
            
            console.log('userId > '+ userId)
            Sales.find({userId:userId}).populate('productId').populate('userId').sort({createdAt:-1})
            .then(sales => {  
                console.log(sales)
                let result =[]                
                sales.forEach((item, index)=> {                       
                    item.createdAt = moment(item.createdAt).format("YYYY/MM/DD")                    
                    result.push(item) 
                })
                let data = {
                    status: 200,
                    result: result
                }
                res.status(200).json(data);
            })
            .catch((err)=>{
                console.log(err)
                var data = {
                    "msg": 'Something Went Wrong....',
                };
                res.status(422).json(data);
            })     
        } else {
            var data = {
                "msg": 'Invalid Method',
            };
            res.status(422).json(data);
        }
        
	},

    updateOrder: function (req, res) {  
        
        if (req.method == 'POST') {
            const v = new Validator(postData, {
                order_id: 'required',
                qty: 'required',
                total: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    var payload = {
                        qty: req.body.qty,
                        total: req.body.total,                        
                        updatedAt: new Date(),
                    }
                    Sales.updateOne({
                            _id: req.body.order_id
                        }, {
                            $set: payload
                        })
                        .then(result => {
                            if (result) {
                                let data = {
                                    msg: 'Updated Successfully...',
                                    status: 200
                                }
                                res.status(200).json(data);
                            } else {
                                let data = {
                                    msg: 'Something Went Wrong...',
                                    status: 422
                                }
                                res.status(422).json(data);
                            }
                        })
                }
            })

        } else {
            var data = {
                "msg": 'Invalid Method',
            };
            res.status(422).json(data);
        }        
	},

    cancelOrder: function (req, res) {          
        if (req.method == 'POST') {
            const v = new Validator(postData, {
               // order_id: 'required',                
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    var payload = {
                        status: 2,                                              
                        updatedAt: new Date(),
                    }
                    console.log(req.body)
                    Sales.updateOne({
                            _id: req.body.order_id
                        }, {
                            $set: payload
                        })
                        .then(result => {
                            if (result) {
                                let data = {
                                    msg: 'Order Cancel Successfully...',
                                    status: 200
                                }
                                res.status(200).json(data);
                            } else {
                                let data = {
                                    msg: 'Something Went Wrong...',
                                    status: 422
                                }
                                res.status(422).json(data);
                            }
                        })
                }
            }) 
        } else {
            var data = {
                "msg": 'Invalid Method',
            };
            res.status(422).json(data);
        }
        
	},
	    
}
