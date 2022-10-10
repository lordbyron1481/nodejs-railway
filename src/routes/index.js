const express=require('express');
const router=express.Router();

const home=require('../controllers/home');
const { filtro } = require('../controllers/image');
const image=require('../controllers/image');
/*const filtro=require('../controllers/filtro');*/
const passport=require('passport');
const {isAuthenticated}=require('../helpers/auth');

const JWT_SECRET='some super secret...';

module.exports=app =>{
    router.get('/', home.index);
    router.get('/images/:image_id', image.index);
    router.post('/images/', image.create);
    router.post('/images/:image_id/like', isAuthenticated, image.like);
    router.post('/images/:image_id/comment', isAuthenticated, image.comment);
    router.delete('/images/:image_id/', image.remove);
    router.get('/filtrado/',image.filtro);
    router.get('/filtrado/:image_id', image.index);
    router.get('/filtrado/filtrociudad',image.filtro);
    router.post('/filtrado/',image.filtro);
    router.get('/maslike', image.maslike);
    router.get('/concursos', image.mascomentados);
    router.get('/cargaranuncio/', isAuthenticated, home.indexcargar);
    router.get('/users/signin', home.ingresar);
    router.get('/users/signup', home.registrar);
    router.get('/users/logout', home.salir);
    router.get('/users/resetpassword/:email/:token', home.reset);
    router.post('/users/resetpassword', home.resetdos);

    //router.get('/users/updated/:email/:token', home.resetdos); 
    router.post('/users/misanuncios', image.misanuncios);
    router.post('/users/signup', home.registrardos);
    router.get('/users/forgotpassword', home.olvidarcontra);
    router.post('/users/forgotpassword', home.olvidarcontrados);
    //router.post('/users/forgotpassword', 
    router.post('/users/signin',passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/users/signin',
        failureFlash: true
        
    }));


    app.use(router);    
};


