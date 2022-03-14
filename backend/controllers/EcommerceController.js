const mongoose = require('mongoose')
const Products = require('../models/Products')
const Sales = require('../models/Sales')
const moment = require("moment-timezone");
const CommonLib = require("../components/CommonLib");
const {
    Validator
} = require('node-input-validator');
module.exports = {	
    list: function (req, res) {
        if (req.method == 'POST') {
            Products.find({}).sort({
                    createdAt: -1
                })
                .then(productList => {
                    let result = []
                    productList.forEach((item, index) => {
                        item.createdAt = moment(item.createdAt).format("YYYY/MM/DD")
                        result.push(item)
                    })
                    let data = {
                        status: 200,
                        result: result
                    }
                    res.status(200).json(data);
                })
                .catch((err) => {
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
    details: function (req, res) {                              
        if (req.method == 'POST') {
            Products.findOne({_id:req.params.id}).sort({
                    createdAt: -1
                })
                .then(productList => {
                    
                    let data = {
                        status: 200,
                        result: productList
                    }
                    res.status(200).json(data);
                })
                .catch((err) => {
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

    createOrder: function (req, res) {                              
        if (req.method == 'POST') {
            postData = req.body;
            const v = new Validator(postData, {
                product_id: 'required',
                qty: 'required',
                total: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    if(req.user && req.user.username)
                    {
                        
                        var sales = new Sales({
                            productId: req.body.product_id,
                            userId: req.user.username,
                            qty : req.body.qty,
                            total : req.body.total,                            
                            status: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        })
                        sales.save()
                            .then((resp) => {
                                var data = {
                                    status: 200,
                                    "msg": 'Product Buy Successfully...',
                                };
                                res.status(200).json(data);
                            })
                            .catch((err) => {
                                console.log(err)
                                var data = {
                                    status: 422,
                                    "msg": 'Something went Wrong...',
                                };
                                res.status(422).json(data);
                            })
                    }
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
