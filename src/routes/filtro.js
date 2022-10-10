const express=require('express');
const router=express.Router();

const filtro=require('../controllers/filtro');


module.exports=app =>{
    
    router.get('/xxx/', filtro.filtrado);
    

    app.use(router);    
};
