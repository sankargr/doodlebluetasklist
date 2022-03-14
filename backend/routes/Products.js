const express = require('express')
const router = express.Router()
const products = require('../controllers/ProductsController')
const app = require('express').Router();
const CommonLib = require("../components/CommonLib");



router.post('/list',CommonLib.verifyToken,products.list)
router.post('/create',CommonLib.verifyToken,products.create)
router.post('/update',CommonLib.verifyToken,products.update)

router.post('/details/:id',CommonLib.verifyToken,products.getProduct)

module.exports =router