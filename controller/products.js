const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
        res.render('portal/add-product', {
            title: 'Add Product',
            bootstrap: 'css/bootstrap.css',
            style: 'css/style.css',
            fontawesome: 'css/font-awesome.css',
            isAuthenticated: true
        });
}

exports.postAddProduct = (req, res, next) => {
    const prodName = req.body.name;
    const ProdPrice = req.body.price;
    const prodDescription = req.body.description;

    const  addProduct = new Product({
        name: prodName,
        price: ProdPrice,
        description: prodDescription,
        userId: req.session.user
    });
    addProduct.save().then(result => {
        //console.log('Product added ' + result);
        res.redirect('/vendors');
    }).catch(err => {
        console.log('Error occured' + err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then( foundProduct => {
       // console.log(foundProduct);
        if(!foundProduct){
            res.redirect('/vendors'); 
        } else {
        res.render('portal/edit-product', {
            title: 'Edit Product',
            bootstrap: 'css/bootstrap.css',
            style: 'css/style.css',
            fontawesome: 'css/font-awesome.css',
            isAuthenticated: true,
            foundProd: foundProduct
        });
        }
    }).catch( err => {
        console.log(err);
    })
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const prodName = req.body.name;
    const prodPrice = req.body.price;
    const prodDsc = req.body.description;

    Product.findById(productId).then( resultProd => {
        resultProd.name = prodName;
        resultProd.price = prodPrice;
        resultProd.description = prodDsc;
        return resultProd.save();
    }).then( result => {
        console.log('Updated');
        res.redirect('/vendors');
    }).catch( err => {
        console.log(err);
    });

}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/vendors');
        })
        .catch(err => console.log(err));
};