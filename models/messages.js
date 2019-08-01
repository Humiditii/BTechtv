const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({ 
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    },
     receipent: {
         type: String,
         required: true
     }

});

module.exports = mongoose.model('Message', messageSchema);

