const express = require('express')
const router = express.Router()
const ecommerce = require('../controllers/EcommerceController')
const CommonLib = require("../components/CommonLib");


router.post('/',CommonLib.verifyToken,ecommerce.list)
router.post('/details/:id',CommonLib.verifyToken,ecommerce.details)

router.post('/createOrder/',CommonLib.verifyToken,ecommerce.createOrder)
//router.post('/updateOrder/',CommonLib.verifyToken,ecommerce.updateOrder)
//router.post('/CancelOrder/',CommonLib.verifyToken,ecommerce.CancelOrder)


module.exports =router