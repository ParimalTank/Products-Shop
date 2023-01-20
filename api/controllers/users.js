const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken")

// User Signup
exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          res.status(409).json({
            message: "Already Hava a Account Using This Email , Try Another One",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            console.log(hash);
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  console.log(result);
  
                  res.status(201).json({
                    message: "User Created Successfully",
                  });
                })
                .catch((err) => {
                  console.log(err);
  
                  res.status(505).json({
                    error: err,
                  });
                });
            }
          });
        }
      });
  }

// User Delete
  exports.user_delete = (req ,res , next) =>{

    User.deleteOne({ _id : req.params.userId})
    .exec()
    .then(result =>{
        console.log("Deleted User" + result);
        res.status(200).json({
            message : "User Deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

// User Login
exports.user_login = (req, res , next) => {

    User.findOne({email : req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(404).json({
                message : "Auth Fail"
            })
        }else{
            bcrypt.compare(req.body.password , user.password , (err , result)=> {
                if(err){
                    res.status(401).json({
                        message : 'Auth Failed'
                    })
                }
                if(result){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            password : user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn : "1h"
                        }
                    );   

                    res.status(200).json({
                        message : 'Auth Successfull',
                        token : token
                    });
                }else{
                    res.status(200).json({
                        message : 'Auth Failed'
                    });
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}