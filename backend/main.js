require('dotenv/config');
const port = 3000
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
moment = require('moment-timezone');

const authRoute = require('./routes/Auth.js'); 

const productRoute = require('./routes/Products.js'); 
const ecommerceRoute = require('./routes/Ecommerce.js'); 
const customersRoute = require('./routes/Customers.js'); 
const reportRoute = require('./routes/Report.js'); 



const app = express();
const log =console.log;





app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/assets'));
app.use(expressLayouts);


app.set('layout', 'index.ejs');
app.set("layout extractScripts", true)
app.set('view engine', 'ejs');



app.use('/auth',authRoute)
app.use('/products',productRoute)
app.use('/ecommerce',ecommerceRoute)
app.use('/user',customersRoute)
app.use('/report',reportRoute)


app.use((req, res, next) => {
    res.status(404).send('Sorry Page Not Found!...');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

mongoose.connect('mongodb://localhost:27017/tutorials',{
   
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

app.locals.moment = moment;