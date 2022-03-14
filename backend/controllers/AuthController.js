const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const becryptjs = require('bcryptjs')
const {
    Validator
} = require('node-input-validator');

const niv = require('node-input-validator');

niv.extend('unique', async ({ value, args }) => {    
    const field = args[1] || 'email';

    let condition = {};
  
    condition[field] = value;
  
    // add ignore condition
    if (args[2]) {
      condition['_id'] = { $ne: mongoose.Types.ObjectId(args[2]) };
    }
  
    let emailExist = await mongoose.model(args[0]).findOne(condition).select(field);
  
    // email already exists
    if (emailExist) {
      return false;
    }
  
    return true;
  });

const CommonLib = require("../components/CommonLib");
var jwt_config = {
    "secret": "SANKAR",
    "refreshTokenSecret": "SANKAR",
    "port": 3000,
    "refreshTokenLife": 86400,
    "tokenLife": 86400
}
module.exports = {
    adminRegister: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            console.log(postData)
            const v = new Validator(postData, {
                name: 'required',
                email: 'required',                
                password: 'required',
            });    
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    User.findOne({
                        email: postData.email,
                        type: 'admin'
                    }, function (err, item) {                        
                        if (item && item._id) {
                            var data = {
                                status: 422,
                                "msg": 'Email Already Exists...',
                            };
                            res.status(200).json(data);
                        }
                        else
                        {
                            becryptjs.hash(req.body.password, 10, function (err, hash) {
                                if (err) {
                                    console.log(err)
                                    var data = {
                                        status: 422,
                                        "msg": 'Something went Wrong...',
                                    };
                                    res.status(422).json(data);
                                } else {
                                    var user = new User({
                                        name: req.body.name,
                                        email: req.body.email,
                                        password: hash,
                                        type: 'admin',
                                        status: 1,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                    })
                                    user.save()
                                        .then((resp) => {
                                            var data = {
                                                status: 200,
                                                "msg": 'New Admin Account Created Successfully...',
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
                            });
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
    adminLogin: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            const v = new Validator(postData, {
                username: 'required',
                password: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    console.log(postData)
                    User.findOne({
                        email: postData.username,
                        type: 'admin'
                    }, function (err, item) {
                        console.log(item)
                        if (item && item._id) {
                            if (becryptjs.compare(req.body.password, item.password)) {
                                let token = jwt.sign({
                                    username: item._id
                                }, jwt_config.secret, {
                                    expiresIn: Math.floor(Date.now() / 1000) + jwt_config.tokenLife
                                });
                                var data = {
                                    status: 200,
                                    token: token,
                                    type: "admin",
                                    username: item.name,
                                    "msg": 'Login In Successfullly ...',
                                };
                                res.status(200).json(data);
                            } else {
                                var data = {
                                    status: 422,
                                    "msg": 'Invalid Password ...',
                                };
                                res.status(200).json(data);
                            }
                        } else {
                            var data = {
                                status: 422,
                                "msg": 'User Name Not Found ...',
                            };
                            res.status(200).json(data);
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
    userRegister: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            console.log(postData)
            const v = new Validator(postData, {
                name: 'required',
                email: 'required',
                password: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    User.findOne({
                        email: postData.email,
                        type: 'user'
                    }, function (err, item) {                        
                        if (item && item._id) {
                            var data = {
                                status: 422,
                                "msg": 'Email Already Exists...',
                            };
                            res.status(200).json(data);
                        }
                        else
                        {
                            becryptjs.hash(req.body.password, 10, function (err, hash) {
                                if (err) {
                                    console.log(err)
                                    var data = {
                                        status: 422,
                                        "msg": 'Something went Wrong...',
                                    };
                                    res.status(422).json(data);
                                } else {
                                    var user = new User({
                                        name: req.body.name,
                                        email: req.body.email,
                                        password: hash,
                                        type: 'user',
                                        status: 1,
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                    })
                                    user.save()
                                        .then((resp) => {
                                            var data = {
                                                status: 200,
                                                "msg": 'New User Account Created Successfully...',
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
                            });
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
    userLogin: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            const v = new Validator(postData, {
                username: 'required',
                password: 'required',
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    console.log(postData)
                    User.findOne({
                        email: postData.username,
                        type: 'user'
                    }, function (err, item) {
                        console.log(item)
                        if (item && item._id) {
                            if (becryptjs.compare(req.body.password, item.password)) {
                                let token = jwt.sign({
                                    username: item._id
                                }, jwt_config.secret, {
                                    expiresIn: Math.floor(Date.now() / 1000) + jwt_config.tokenLife
                                });
                                var data = {
                                    status: 200,
                                    token: token,
                                    "msg": 'Login In Successfullly ...',
                                };
                                res.status(200).json(data);
                            } else {
                                var data = {
                                    status: 422,
                                    "msg": 'Invalid Password ...',
                                };
                                res.status(200).json(data);
                            }
                        } else {
                            var data = {
                                status: 422,
                                "msg": 'User Name Not Found ...',
                            };
                            res.status(200).json(data);
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
    checkLoginToken: function (req, res) {
        if (req.method == 'POST') {
            postData = req.body;
            const v = new Validator(postData, {
                token: 'required',               
            });
            v.check().then((matched) => {
                if (!matched) {
                    res.status(400).json(CommonLib.errorFormat(v))
                } else {
                    const token =  req.body.token || req.query.token || req.headers["access-token"];
                    if (!token) {
                        let data = {
                            status :302,
                            msg : 'A token is required for authentication',
                            redirect :true,
                            redirectUrl: '/auth/user/login'
                        }
                        return res.status(302).json(data);
                    }
                    try {
                        const decoded = jwt.verify(token, 'SANKAR');
                        console.log(decoded)
                        if(decoded)
                        {
                            User.findOne({
                                _id: decoded.username,                            
                            }, function (err, item) {
                                console.log(item)
                                if (item && item._id) {
                                    var data = {
                                        status: 200,
                                        token: token,
                                        name : item.name,
                                        type : item.type,
                                        "msg": 'Login In Successfullly ...',
                                    };
                                    res.status(200).json(data);
                                } else {
                                    let data = {
                                        status :302,
                                        msg : 'Invalid Token',
                                        redirect :true,
                                        redirectUrl: '/auth/user/login'
                                    }
                                     res.status(302).json(data);
                                }
                            })
                        }
                        else
                        {
                            let data = {
                                msg : 'Invalid Token',
                                redirect :true,
                                redirectUrl: '/auth/user/login'
                            }
                             res.status(302).json(data);
                        }
                    } catch (err) {
                        console.log(err)
                        let data = {
                            msg : 'Invalid Token',
                            redirect :true,
                            redirectUrl: '/auth/user/login'
                        }
                         res.status(302).json(data);
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