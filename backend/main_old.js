const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
const mongoose = require('mongoose')
const port = 3000
var path = require('path')
var bodyParser = require('body-parser')
var expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.use(express.static(__dirname + '/assets'));


//route declaration Start
const authRoute =  require('./routes/Auth')
const productRoute =  require('./routes/Products')
const customerRoute =  require('./routes/Customers')
app.use('/auth',authRoute)
app.use('/products',productRoute)
//app.use('/customer',customerRoute)

//route declaration end




app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.set('view-engine', 'ejs')
app.set('layout', 'index.ejs');
app.set('views', path.join(__dirname, 'views'));



mongoose.connect('mongodb://localhost:27017/restaurant');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("db connected..");
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



app.post('/signup', (req, res) => {
    res.send(req.body)
})

/*

app.get('/', (req, res) => {
    res.render('index.ejs',{
        name : 'GR'
    })
})



app.get('/login', (req, res) => {
    res.render('login.ejs')
})



app.post('/signup', async(req, res) => {
    try{
        const pwd = await bcrypt.hash(req.body.password,10)
        log(pwd)
    }
    catch(e)
    {
       log(e)
    }
    log(req.body.name)
})



app.post('/register', async(req, res) => {
    //console.log(req.body)
    log((req.body))
    becryptjs.hash(req.body.password, 10, function(err, hash) {
        if(err)
        {
            console.log(err)
            res.json({
                msg : 'err'
            })
        }
        else
        {
            var user = new User({
                name : req.body.name,
                email : req.body.email,
                password : hash,
                phone : req.body.phone,
            })
            user.save()
            .then((resp)=>{
                res.json({
                    msg : 'Created Successfully...'
                })
            })
            .catch((err)=>{
                res.json({
                    msg : 'err'
                })
            })
          
        }
    });
})

*/