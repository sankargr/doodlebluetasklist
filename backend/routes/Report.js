const express = require('express')
const router = express.Router()
const report = require('../controllers/ReportController')
const app = require('express').Router();
const CommonLib = require("../components/CommonLib");



router.post('/details',CommonLib.verifyToken,report.details)
router.post('/customer-sales-report',CommonLib.verifyToken,report.customerSalesReport)
router.post('/product-sales-report',CommonLib.verifyToken,report.productSalesReport)


module.exports =router