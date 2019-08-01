const mongoose = require('mongoose');

let registrationSchema = new mongoose.Schema({
    name : {
        type: String,
    },
    email: {
        type: String
    },
    address: {
        type:String
    },
    phone: {
        type: String
    }, 
    category: {
        type: String
    }, 
    password: {
        type: String
    }
});

mongoose.model('Register', registrationSchema);

