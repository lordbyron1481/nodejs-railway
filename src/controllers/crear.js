const ctrl={};

const { Image }= require('../models');
const sidebar=require('../helpers/sidebar');

ctrl.index = async (req, res)=>{
   
    res.redirect('/cargaranuncio/');
   //res.render('cargaranuncio', viewModel);
};

module.exports=ctrl;
