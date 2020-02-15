const express = require('express');
const morgan = require('morgan');
const engine = require('ejs-mate');
const path = require('path');
const session =require('cookie-session');
const app = express();
//configuraciones settings 
app.set('port', process.env.PORT || 3000);
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//middleware 
app.use(morgan('dev'));
app.use(session({
    secret: 'mysecretword',
    signed: true
}));
//funcion para comvertir fecha
app.use((req, res, next) => {
    res.locals.formatDate = (date) => {
      let myDate = new Date(date * 1000);
      return myDate.toLocaleString();
    }
        // verifica su esta logeado

    if(req.session.access_token && req.session.access_token != 'undefined') {
      res.locals.isLoggedIn = true;
    } else {
      res.locals.isLoggedIn = false;
    }
    next();
  });





//rutas routes
app.use(require('./routes/index'));

// archivos estaticos   statics files

//starting server  inicio del servidor 
app.listen(app.get('port'), ()=>{
    console.log(`server on en el puerto ${app.get('port')}`);

}); 