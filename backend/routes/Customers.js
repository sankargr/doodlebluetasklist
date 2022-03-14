const express = require('express')
const router = express.Router()
const user = require('../controllers/UserController')

const CommonLib = require("../components/CommonLib");


router.post('/orders',CommonLib.verifyToken,user.orderlist)
router.post('/updateOrder',CommonLib.verifyToken,user.updateOrder)
router.post('/cancelOrder',CommonLib.verifyToken,user.cancelOrder)



module.exports =router