const mongoose = require('mongoose')
const Sales = require('../models/Sales')
const Products = require('../models/Products')
const User = require('../models/User')
const moment = require("moment-timezone");
var Promise = require("bluebird");
const CommonLib = require("../components/CommonLib");
const {
    Validator
} = require('node-input-validator');

module.exports = {	
    details: function (req, res) {  
        
        if (req.method == 'POST') {

            var userList = function () {
				return User.find({
					type:'user'
				}).lean();
			}.bind(this);
            var productList = function () {
				return Products.find({					
				}).lean();
			}.bind(this);
            Promise.all([
				userList(),
				productList()
			]).spread(function (users, allproducts) {            
				var data = {
                    status :200,
					'users': users,
					'products': allproducts					
				}				
                res.status(200).json(data);
				
			}).catch(function (err) {
				console.log(err);
                var data = {
                    status :422,
                    "msg": 'Something Went Wrong....',
                };
                res.status(422).json(data);
			}); 
        } else {
            var data = {
                status :422,
                "msg": 'Invalid Method',
            };
            res.status(422).json(data);
        }
        
	},


    customerSalesReport: function (req, res) {          
        if (req.method == 'POST') {
            var start_day = new Date(),
				end_day = new Date();


            if(req.body.start_date) 
            {
                start_day = new Date(req.body.start_date);
            }
            if(req.body.end_date) 
            {
                end_day = new Date(req.body.end_date);
            }
            if(req.body.from_date) 
            {
                start_day = new Date(req.body.from_date);
            }
            if(req.body.to_date) 
            {
                end_day = new Date(req.body.to_date);
            }
            start_day = new Date(start_day.setHours(0,0,0,0));
            end_day = new Date(end_day.setHours(23,59,59,0));
            
            var saleAggQry=[
                {$match:{createdAt:{$gte: start_day, $lte: end_day}}},	
                {$group:{_id:"$userId",
                        sales_count:{$sum:1},
                        total_sales:{$sum:{$toDecimal:"$total"}},                        
                        }},
                {$sort: {createdAt: 1}}

            ]
            if(req.body.status)
            {
                saleAggQry[0].$match.status = req.body.status
            }
            if(req.body.userId)
            {
                saleAggQry[0].$match.userId = new ObjectId(req.body.userId)
            }      

            if(req.body.dateDecending)
            {
                saleAggQry[2].$sort.createdAt = -1
            } 
            if(req.body.dateAccending)
            {
                saleAggQry[2].$sort.createdAt = 1
            } 


            console.log(JSON.stringify(saleAggQry))
            var salesList = function () {
				return Sales.aggregate(saleAggQry);
			}.bind(this);
            var userList = function () {
				return User.find({					
				}).lean();
			}.bind(this);

            Promise.all([
				salesList(),
                userList(),
			]).spread(function (Sales,userList) {            
                let allUsers ={}  
                let result = []              
                userList.forEach(function(user) 
                {
                    allUsers[user._id] = user.name
                });

                console.log(allUsers)
                Sales.forEach(function(sale,idx) 
                {
                    let data = {
                        no : idx+1,
                        userName : allUsers[sale._id],
                        userId : sale._id,
                        sales_count : sale.sales_count,
                        totalAmount : sale.total_sales
                    }
                    result.push(data)
                });

				var data = {
                    status :200,
					'result': result,								
				}				
                res.status(200).json(data);		

			}).catch(function (err) {
				console.log(err);
                var data = {
                    "msg": 'Something Went Wrong....',
                };
                res.status(422).json(data);
			}); 
        } else {
            var data = {
                "msg": 'Invalid Method',
            };
            res.status(422).json(data);
        }
        
	},

    productSalesReport: function (req, res) {          
        if (req.method == 'POST') {
            var start_day = new Date(),
				end_day = new Date();


            if(req.body.start_date) 
            {
                start_day = new Date(req.body.start_date);
            }
            if(req.body.end_date) 
            {
                end_day = new Date(req.body.end_date);
            }
            if(req.body.from_date) 
            {
                start_day = new Date(req.body.from_date);
            }
            if(req.body.to_date) 
            {
                end_day = new Date(req.body.to_date);
            }
            start_day = new Date(start_day.setHours(0,0,0,0));
            end_day = new Date(end_day.setHours(23,59,59,0));
            var ObjectId = require('mongodb').ObjectId;
            var saleAggQry=[
                {$match:{createdAt:{$gte: start_day, $lte: end_day}}},	
                {$group:{_id:"$productId",
                        sales_count:{$sum:1},
                        total_sales:{$sum:{$toDecimal:"$total"}},                        
                        }},
                        {$sort: {createdAt: 1}}
            ]
            if(req.body.status)
            {
                saleAggQry[0].$match.status = req.body.status
            }
            if(req.body.userId)
            {
                saleAggQry[0].$match.userId = req.body.userId
            }          
            if(req.body.productId)
            {
                saleAggQry[0].$match.productId = new ObjectId(req.body.productId)
            }  
            if(req.body.dateDecending)
            {
                saleAggQry[2].$sort.createdAt = -1
            } 
            if(req.body.dateAccending)
            {
                saleAggQry[2].$sort.createdAt = 1
            } 

            

            console.log(JSON.stringify(saleAggQry))
            var salesList = function () {
				return Sales.aggregate(saleAggQry);
			}.bind(this);
            var userList = function () {
				return User.find({
					type:'user'
				}).lean();
			}.bind(this);
            var productLists = function () {
				return Products.find({					
				}).lean();
			}.bind(this);
            Promise.all([
				salesList(),
                userList(),
                productLists(),
			]).spread(function (Sales,userList,productList) {            
                let allUsers ={}  
                let allProduct={}
                let result = []              
                userList.forEach(function(user) 
                {
                    allUsers[user._id] = user.name
                });
                productList.forEach(function(user) 
                {
                    allProduct[user._id] = user.name
                });
                Sales.forEach(function(sale,idx) 
                {
                    let data = {
                        no : idx+1,
                        productName : allProduct[sale._id],
                        productId : sale._id,
                        sales_count : sale.sales_count,
                        totalAmount : sale.total_sales
                    }
                    result.push(data)
                });

				var data = {
                    status :200,
					'result': result,								
				}				
                res.status(200).json(data);		

			}).catch(function (err) {
				console.log(err);
                var data = {
                    "msg": 'Something Went Wrong....',
                };
                res.status(422).json(data);
			}); 
        } else {
            var data = {
                "msg": 'Invalid Method',
            };
            res.status(422).json(data);
        }
	},

    
	    
}
