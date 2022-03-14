const mongoose = require('mongoose')
const Products = require('../models/Products')
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
    create: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            const v = new Validator(postData, {
                name: 'required',
                price: 'required',
                desc: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    Products.findOne({
                        name: postData.name,
                    }, function (err, item) {
                        if (item && item._id) {
                            var data = {
                                status: 422,
                                "msg": 'Product Name Is Already Exists...',
                            };
                            res.status(200).json(data);
                        } else {
                            var products = new Products({
                                name: req.body.name,
                                price: req.body.price,
                                desc: req.body.desc,
                                status: 1,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            })
                            products.save(data)
                                .then(productList => {
                                    let data = {
                                        msg: 'Product Created  Successfully...',
                                        status: 200
                                    }
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
    update: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            const v = new Validator(postData, {
                id: 'required',
                name: 'required',
                price: 'required',
                desc: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    var payload = {
                        name: req.body.name,
                        price: req.body.price,
                        desc: req.body.desc,
                        updatedAt: new Date(),
                    }
                    Products.updateOne({
                            _id: req.body.id
                        }, {
                            $set: payload
                        })
                        .then(result => {
                            if (result) {
                                let data = {
                                    msg: 'Product Updated Successfully...',
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
    getProduct: function (req, res) {
        if (req.method == 'POST') {
            Products.findOne({
                    _id: req.params.id
                })
                .then(productData => {
                    let data = {
                        status :200,
                        result: productData
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
}