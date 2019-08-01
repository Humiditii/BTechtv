const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registrationSchema = new Schema({
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

module.exports = mongoose.model('Register', registrationSchema);


