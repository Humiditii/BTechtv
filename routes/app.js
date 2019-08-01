const path = require('path');

const express = require('express');



const appController = require('../controller/app');
const contactController = require('../controller/contact');
const authController = require('../controller/auth');
const productController = require('../controller/products');
const isAuth = require('../middleware/is_auth');


const router = express.Router();

router.get('/',  appController.getIndex);

router.get('/about', appController.getAbout);

router.get('/services', appController.getServices);

router.get('/contact', appController.getContact);

router.post('/contact', contactController.contactUs);

router.get('/message', appController.getMessage);

router.post('/message', appController.postMessage);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.get('/reset', authController.getResetPwd);

router.post('/reset', authController.postResetPwd);

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/vendors', isAuth.isAuthProctection, authController.getVendor);

router.get('/builders', isAuth.isAuthProctection, authController.getBuilder);

router.get('/edit-pwd', isAuth.isAuthProctection, authController.getChangePwd);

router.post('/edit-pwd', isAuth.isAuthProctection, authController.postChangePwd);

router.get('/add-product', isAuth.isAuthProctection, productController.getAddProduct);

router.post('/add-product', isAuth.isAuthProctection, productController.postAddProduct);

router.get('/:productId', isAuth.isAuthProctection, productController.getEditProduct);

router.post('/remove-message', isAuth.isAuthProctection, authController.postDeleteMessage);

router.post('/delFromBuilder', isAuth.isAuthProctection, authController.delFromBuil);


router.post('/delete-product', isAuth.isAuthProctection, productController.postDeleteProduct);

router.post('/edit-product', isAuth.isAuthProctection, productController.postEditProduct);

module.exports = router;