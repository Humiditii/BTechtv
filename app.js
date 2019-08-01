const path = require('path');
const express = require('express');
require('./models/db');

const app = express();

const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const favicon = require('serve-favicon');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);

const MONGO_URI = 'mongodb://localhost:27017/technivo';

const  store = new mongoDbStore({
    uri: MONGO_URI,
    collection: 'sessions'
});

app.engine('hbs', expressHbs({layoutsDir: 'views/layouts', defaultLayout: 'main-layout', extname: 'hbs'}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const applicationRoutes = require('./routes/app');


app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret' ,
                resave: false,
                saveUninitialized: false,
                store: store
            }));



app.use(applicationRoutes);



const port = process.env.port || 7000;
 app.listen(port, ()=>{
    // console.log('serving on port ' + port);
 });


