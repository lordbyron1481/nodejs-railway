
const ctrl={};
const {Image}=require('../models/');
const sidebar=require('../helpers/sidebar');
const path=require('path');

/*ctrl.filtrado = async (req, res)=>{
    
    const filtros = await Image.find({ciudad:'Cartagena'}).lean();
    
    let viewModel={filtros: []};
    
    viewModel.filtros=filtros;
    
    viewModel=await sidebar(viewModel);
    console.log(viewModel);
    
    res.render('filtros', viewModel);
 };
 
 module.exports=ctrl;
 */