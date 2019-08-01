const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/technivo';
mongoose.connect(MONGO_URI, {
            useNewUrlParser: true
        }, (err) => {
    if (!err) {
        console.log('Mongodb connected successfully');
    }else{
        console.log('Failed to connect  ' + err);
    }
});

require('./register.model');
