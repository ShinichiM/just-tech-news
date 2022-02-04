const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// serve files in public folder as static assets
app.use(express.static(path.join(__dirname, 'public')));

// express middleware to process incoming json requests excluding form requests
app.use(express.json());
// express middleware to process incoming json requests from html forms
app.use(express.urlencoded({ extended: true }));
// turn on routes
app.use(routes);


// turn on connection to db and server
// .sync() establishes connection to database // IF force: true, it would force the database to drop and re-create all tables on startup
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now Listening on PORT: ${PORT}`))
});