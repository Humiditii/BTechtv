const mongoose = require('mongoose');
const crypto = require("crypto");
const bycrypt = require('bcryptjs');
const newClient =require('../models/register.model');
const Product = require('../models/products');
const Message = require('../models/messages');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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',
    }
}));

exports.getRegister = (req, res, next) => {
    const err = req.query.err;
    res.render('portal/register', {
        title: 'Registration Portal',
        bootstrap: 'css/bootstrap.css',
        style: 'css/style.css',
        fontawesome: 'css/font-awesome.css',
        activeRegister: true,
        banner: 'banner',
        error: err
    });
}
exports.postRegister = (req, res, next) => {

    const reqName = req.body.Name;
    const reqEmail = req.body.Email;
    const reqAddress = req.body.Address;
    const reqPhone = req.body.Phone;
    const reqCategory = req.body.category;
    const reqPassword = req.body.Password;

    newClient.findOne({
        email: reqEmail
    }).then(resultEmail => {
        if (resultEmail) {
            let err = 'Email already exist';
            res.redirect('/register?err=Email already exist');
            throw err;
        } else {
            return bycrypt.hash(reqPassword, 12).then(hashedPassword => {
                const registerNew = new newClient({
                    name: reqName,
                    email: reqEmail,
                    address: reqAddress,
                    phone: reqPhone,
                    category: reqCategory,
                    password: hashedPassword
                });
                
                return registerNew.save().then(result => {
                    res.redirect('/login');
                   return transporter.sendMail({
                        to: reqEmail,
                        from: 'BTech.com',
                        subject: 'Registration successful',
                        html:   `
                                <h1> You have successfully logged in </h1>
                                `
                    }).then( result => {
                        throw result + 'registered successfully';
                    });
                });
            }).catch(err => {
                throw err;
            });
        }
    }).catch(err => {
        console.log('error occured ' + err);

    });

}

exports.getLogin = (req, res, next) => {

   const error = req.query.err;


    res.render('portal/login', {
        title: 'Login Portal',
        bootstrap: 'css/bootstrap.css',
        style: 'css/style.css',
        fontawesome: 'css/font-awesome.css',
        activeLogin: true,
        banner: 'banner',
        err: error
    });
}

exports.postLogin = (req, res, next) => {

    const requestEmail = req.body.Email;
    const requestPassword = req.body.Password;

    newClient.findOne({email: requestEmail}).then( user => {
        if (!user) {
            res.redirect('/login?err=Can Not Find User ');
            let err = 'Can not find user';
            throw err
        }else {
            bycrypt.compare(requestPassword, user.password).then( domatch => {
                if (domatch) {
                   if (user.category == 'Vendor') {
                
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save( err => {
                          console.log(err + req.session.user + 'logged in')
                         return res.redirect('/vendors');
                      });

                   } else {
                       if (user.category = 'Technician') {

                           req.session.isLoggedIn = true;
                           req.session.user = user;
                          return req.session.save( err => {
                              console.log(err + req.session.user + 'logged in');
                            return res.redirect('/builders');
                          });
                       }
                   }
                } else {
                    res.redirect('/login?err=Incorrct password');
                    let err = 'incorrect password';
                    throw err
                }
                
            }).catch(err => {
                console.log('An error occured ' + err);
            });
        }
    }).catch(err => {
        console.log('error occured ' + err);
    });

 
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err + 'DESTROYED');
        res.redirect('/');
    });
};

exports.getVendor = (req, res, next) => {
    const userLoggedIn = req.session.user;
    const IdOriginal = userLoggedIn._id;
   // console.log(IdOriginal +"is the user id");
    Product.find({userId: req.session.user}).then( userProd => { 
        Message.find({receipent : IdOriginal}).then( messagesFound => {
           // console.log(messagesFound);
                    res.render('portal/vendors', {
                        title: 'vendor',
                        bootstrap: 'css/bootstrap.css',
                        style: 'css/style.css',
                        fontawesome: 'css/font-awesome.css',
                        isAuthenticated: true,
                        products: userProd,
                        productLength: userProd.length,
                        messagesSent: messagesFound,
                        messagesLen: messagesFound.length,
                        vendor:true
                    });
        }).catch( err => {
            console.log(err+ 'Unable to find message');
        })
    }).catch(err => [
        console.log(err)
    ]);
    
}

exports.postDeleteMessage = (req, res, next) => {
    const msgId = req.body.messageId;
    Message.findByIdAndRemove(msgId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/vendors');
        })
        .catch(err => console.log(err));
}

exports.delFromBuil = (req, res, next) => {
    const msgId = req.body.messageId;
    Message.findByIdAndRemove(msgId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/builders');
        })
        .catch(err => console.log(err));
}

exports.getBuilder = (req, res, next) => {
 const userLoggedIn = req.session.user;
 const IdOriginal = userLoggedIn._id;
    newClient.find({category: 'Vendor'}).then( venList => {
        Message.find({receipent : IdOriginal}).then( messagesFound => {
            return res.render('portal/builders', {
                title: 'Technician',
                bootstrap: 'css/bootstrap.css',
                style: 'css/style.css',
                fontawesome: 'css/font-awesome.css',
                isAuthenticated: true,
                list: venList,
                venNo: venList.length,
                messagesSent: messagesFound,
                messagesLen: messagesFound.length,
                productLeng: Product.length,
                builder: true
            })
        }).catch( err => {
            console.log(err);
        });       
    }).catch( err => console.log(err));   
}

exports.getResetPwd = (req, res, next) => {
    const message = req.query.msg;
    res.render('portal/reset', {
        title: 'Password reset',
        bootstrap: 'css/bootstrap.css',
        style: 'css/style.css',
        fontawesome: 'css/font-awesome.css',
        banner: 'banner',
        msg: message

    });
}

exports.postResetPwd = (req, res, next) => {
    const reqEmail = req.body.Email;
    newClient.findOne({email: reqEmail}).then( user => {
        if (!user) {
            res.redirect('/reset?msg=Invalid Email');
        }else{
            console.log(user);

            const newPwd = crypto.randomBytes(16).toString("hex");
            bycrypt.hash(newPwd, 12).then( hashedPwd => {
                user.updateOne({
                    password: hashedPwd
                }).then(result => {
                   //console.log(result);
                   res.redirect('/reset?msg=Password reset successful');
                   return transporter.sendMail({
                       to: reqEmail,
                       from: 'Btech.com',
                       subject: 'BTech password reset for ',
                       html: '<h1>Your password reset was successful</h1> <p>Please kindly login with this new password <b style="color:red">'+newPwd+'</b></p>'
                   }).then( result => {
                      // console.log(result);
                   }).catch(err => {
                       console.log(err)
                   });
                }).catch( err => {
                    console.log(err +'Unable to update the password');
                })
            }).catch(err => {
                console.log(err + "Error hashing password");
            })
        }
    })
}

exports.getChangePwd = (req, res, next) => {
    const message = req.query.msg;
    const userType = req.query.type

    const confirmType = (userType) => {
        if (userType == 'vendor') {
            return 'vendor';
        } else if (userType == 'builders') {
            return 'builder';
        }
    }
    res.render('portal/edit-pwd', {
        title: 'Edit password',
        bootstrap: 'css/bootstrap.css',
        style: 'css/style.css',
        fontawesome: 'css/font-awesome.css',
        isAuthenticated: true,
        msg: message,
        type: confirmType(userType)
    });
}

exports.postChangePwd = (req, res, next) => {
   
    const userLogged = req.session.user;
    const reqOld = req.body.oldPwd;
    const reqNew = req.body.newPwd;
    const reqConfirm = req.body.confirmPwd;

   // console.log(userLogged);

    newClient.findById(userLogged._id).then( user => {
       // console.log(result);
       bycrypt.compare(reqOld, user.password).then( domatch => {
            if (!domatch) {
                return res.redirect('/edit-pwd?msg=invalid Old Password');
            } else{
                if (reqNew != reqConfirm) {
                    return res.redirect('/edit-pwd?msg=Your new passwords does not match');
                }else{
                    if( reqNew == reqConfirm) {
                        bycrypt.hash(reqConfirm, 12).then( hashed => {
                            user.updateOne({password: hashed}).then( result => {
                                res.redirect('/edit-pwd?msg=Password Changed successfully');
                            }).catch( err => {
                                console.log(err)
                            })
                        }).catch( err => {
                            console.log(err);
                        })
                    }
                }
            }
       })
       
    })
   


}
