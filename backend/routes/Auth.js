const express = require('express')
const router = express.Router()
const auth = require('../controllers/AuthController')



router.post('/checkLoginToken',auth.checkLoginToken)

router.post('/admin/register',auth.adminRegister)
router.post('/admin/login',auth.adminLogin)

router.post('/user/register',auth.userRegister)
router.post('/user/login',auth.userLogin)


module.exports =router