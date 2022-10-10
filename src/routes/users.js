const express=require('express');
const router=express.Router();
const passport=require('passport');
//const home=require('../controllers/home');
//const image=require('../controllers/image');

router.get('/signin', (req,res) =>{
    res.send('Ingresando a la app');
});
/*
router.post('/users/signin',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/signin',
    failureFlash: true
    
}));*/

router.get('/signup', (req,res) =>{
    res.send('Formulario de autenticacion');
});

module.exports=router;
