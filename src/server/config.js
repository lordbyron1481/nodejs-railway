const path=require('path');
const exphbs=require('express-handlebars');
const morgan=require('morgan');
const multer=require('multer');
const express=require('express');
const routes=require('../routes/index');
const errorHandler = require('errorhandler');
const handlebars = require('handlebars');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const { helpers } = require('handlebars');
require('../controllers/passport');

module.exports=app => {
    
    app.set('port',process.env.PORT || 3000);
    app.set('views',path.join(__dirname, '../views'));
    app.engine('.hbs', exphbs.engine({
        defaultLayout: 'main',
        partialsDir: path.join(app.get('views'), 'partials'),
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: '.hbs',
        helpers: require('./helpers')
    }));
    app.set('view engine', '.hbs');
    
    //midlewares:
    
    app.use(morgan('dev'));
    app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'));
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(methodOverride('_method'));
    app.use(session({ secret: 'miappsecreta',
        resave: true,
        saveUninitialized: true
    }));
    
    app.use((req, res, next) => {
        res.locals.isAnd=helpers.boton
        next();
    })

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    app.use((req, res, next)=>{
        res.locals.success_msg=req.flash('success_msg');
        res.locals.error_msg=req.flash('error_msg');
        res.locals.error=req.flash('error');
        res.locals.error_eliminar=req.flash('error_eliminar');
        res.locals.usuario=req.user||null;
        //res.locals.prueba='hola';
        //console.log(usuario);
        next();
    });

    routes(app);
    
    //static files
    app.use('/public',express.static(path.join(__dirname, '../public')));
    //errorhandlers
    if ('development'===app.get('env')){
        app.use(errorHandler);
    }
    
    return app;
}



