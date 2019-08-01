const mongoose = require('mongoose');
const User = require('../models/register.model');
const messageModel = require('../models/messages');
exports.getIndex = (req, res, next) => {
    if (req.session.isLoggedIn) {
        
            res.render('index', 
            {
                title: 'Technivo Tv homepage',
                bootstrap: 'css/bootstrap.css',
                style: 'css/style.css',
                fontawesome: 'css/font-awesome.css',
                activeHomePage: true,
                banner: 'banner',
                isAuthenticated: true
            });
    }else{
            res.render('index',
            {
                title: 'Technivo Tv homepage',
                bootstrap: 'css/bootstrap.css',
                style: 'css/style.css',
                fontawesome: 'css/font-awesome.css',
                activeHomePage: true,
                banner: 'banner',
            });
    }

}

exports.getAbout = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.render('about', 
        {
            title: 'About',
            bootstrap: 'css/bootstrap.css',
            style: 'css/style.css',
            fontawesome: 'css/font-awesome.css',
            activeAbout: true,
            banner: 'banner',
            isAuthenticated: true
        });
    } else{
        res.render('about', 
        {
            title: 'About',
            bootstrap: 'css/bootstrap.css',
            style: 'css/style.css',
            fontawesome: 'css/font-awesome.css',
            activeAbout: true,
            banner: 'banner'
        });
    }
    
}

const ITEMS_PER_PAGE = 4;
const pageNumber = (countParam) => {

    const pageTotal = countParam / ITEMS_PER_PAGE;
    for (let index = 1; index < pageTotal + 1; index++) {

        let emptyArray =  [] ;
        let emptyObject = { id: emptyArray};
        emptyArray.push(index);
        return emptyObject;
    }

}
exports.getServices = (req, res, next) => {
    if (req.session.isLoggedIn) {
        const page = req.query.page;
        User.find().then(iWantToCount => {
            const countModel = iWantToCount.length;
            User.find({
                category: 'Vendor'
            }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).then(result => {
                User.find({
                    category: 'Technician'
                }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).then(technician => {
                    res.render('services', {
                        title: 'Services',
                        bootstrap: 'css/bootstrap.css',
                        style: 'css/style.css',
                        fontawesome: 'css/font-awesome.css',
                        activeServices: true,
                        banner: 'banner',
                        isAuthenticated: true,
                        vendors: result,
                        builders: technician,
                        pages: pageNumber(countModel)

                    });
                }).catch(err => {
                    console.log(err);
                });

            }).catch(err => {
                console.log(err)
            });
        }).catch( err=> {
            console.log(err)
        })
    } else {
        const page = req.query.page;
        User.find().then( iWantToCount => {
            const countModel = iWantToCount.length;
            User.find({
                category: 'Vendor'
            }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).then(result => {
                console.log(result);
                User.find({
                    category: 'Technician'
                }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).then(technician => {
                    // console.log(technician);
                    // console.log(countModel);
                    res.render('services', {
                        title: 'Services',
                        bootstrap: 'css/bootstrap.css',
                        style: 'css/style.css',
                        fontawesome: 'css/font-awesome.css',
                        activeServices: true,
                        banner: 'banner',
                        vendors: result,
                        builders: technician,
                        pages: pageNumber(countModel),
                    });
                }).catch(err => {
                    console.log(err);
                });

            }).catch(err => {
                console.log(err)
            });
        }).catch(err => {
            console.log(err)
        })
    }
    
    
}

exports.getContact = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.render('contact', {
            title: 'Contact',
            bootstrap: 'css/bootstrap.css',
            style: 'css/style.css',
            fontawesome: 'css/font-awesome.css',
            activeContact: true,
            banner: 'banner',
            isAuthenticated: true
        });
    } else{
        res.render('contact', {
            title: 'Contact',
            bootstrap: 'css/bootstrap.css',
            style: 'css/style.css',
            fontawesome: 'css/font-awesome.css',
            activeContact: true,
            banner: 'banner'

        });
    }
}

exports.getMessage = (req, res, next) => {
    
    const receipentId = req.query.user;
    User.findById(receipentId).then( foundReceiprnt => {
            res.render('send-msg', {
                title: 'Send Message',
                bootstrap: 'css/bootstrap.css',
                style: 'css/style.css',
                fontawesome: 'css/font-awesome.css',
                banner: 'banner',
                receiver: foundReceiprnt
            });
           // console.log(foundReceiprnt + "found");
    })
}

exports.postMessage = (req, res, next) => {
    const receipentId = req.body.client;
    const reqName = req.body.name;
    const reqAddress = req.body.address;
    const reqPhone = req.body.phone;
    const reqMessage = req.body.message;

    const newMessage = new messageModel({
        name: reqName,
        address: reqAddress,
        phone: reqPhone,
        message: reqMessage,
        receipent: receipentId,
    });

    return newMessage.save().then( result => {
         res.redirect('/message?user='+receipentId);
        console.log('sent');
    })

    //console.log(receipentId);


    
}
