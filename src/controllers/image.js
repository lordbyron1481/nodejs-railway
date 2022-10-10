const ctrl={};
const path=require('path');
const {randomNumber} = require('../helpers/libs');
const fs=require('fs-extra');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const User=require('../models/users');
const {Image, Comment}=require('../models/');
const sidebar=require('../helpers/sidebar');
const { json } = require('express');
const users = require('../models/users');
const usuario=require('../server/config');





ctrl.index=async(req, res)=>{
    
    let viewModel={image: {}, comments: {}};
    const image=await Image.findOne({filename:{$regex:req.params.image_id}}).lean({virtuals:true});
    const imagedos=await Image.findOne({filename:{$regex:req.params.image_id}});


    if(image){

        imagedos.vistas=imagedos.vistas+1;
        viewModel.image=image;
        await imagedos.save();
        const comments= await Comment.find({image_id:image._id}).lean({virtuals:true});
        viewModel.comments=comments;
        viewModel=await sidebar(viewModel);
        /*console.log(sidebar.popular);*/
        //console.log(viewModel);
        
        res.render('image', viewModel);
    }else{
        res.redirect('/');
    }
    
};

ctrl.create= (req, res)=>{

    const saveImage=async()=>{
        const imgURL=randomNumber();
        const imagenes=await Image.find({filename: imgURL});
        if (imagenes.length>0){
            saveImage();
        }else{
            console.log(imgURL);
            const imageTempPath=req.file.path;
            const ext=path.extname(req.file.originalname).toLowerCase();
            const targetPath=path.resolve(`src/public/upload/${imgURL}${ext}`)
        
            if (ext==='.png'||ext==='.jpg'||ext==='.jpeg'||ext==='.gif'){
                await fs.rename(imageTempPath, targetPath);
                const newImg=new Image({
                email:req.body.email,    
                nameuser:req.body.nameuser,
                name:req.body.name,
                raza:req.body.raza,
                ciudad:req.body.ciudad,
                tipo:req.body.tipo,
                contacto:req.body.contacto,
                filename:imgURL + ext,
                descripcion:req.body.descripcion
                });
                const imagenguardada=await newImg.save();
                res.redirect('/images/'+ imgURL);
                /*res.send('funciona');*/
                /* console.log(newImg);*/
            }else{
                await fs.unlink(imageTempPath);
                res.status(500).json({error: 'Solo se permiten imagenes'});
            }
            
        }
        

    };
    saveImage();
        
};

ctrl.like=async(req, res)=>{
    const image=await Image.findOne({filename:{$regex: req.params.image_id}});
    
    if(image){
        image.likes=image.likes+1;
        await image.save();
        
        res.json({likes: image.likes});
        
    }else{
        res.status(500).json({error: 'Internal Error'});
    }
};


ctrl.comment=async(req, res)=>{
    
    
    //console.log(usuario.email);
    //console.log(users.length);
    //const emailUser=await Image.findOne({email: usuario.email});
    const image=await Image.findOne({filename:{$regex: req.params.image_id}});
    if (image){
        const newComment=new Comment(req.body);
        newComment.image_id=image._id;
        //newComment.name;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId);

    }else{
        res.redirect('/');
    }
};

ctrl.remove=async(req, res)=>{
   // const {name, email, password, cpassword}=req.body;
   
    const image= await Image.findOne({filename: {$regex: req.params.image_id}});
    //if(image.email!=req.user.email) {  
      //  console.log('no se puede');
        //req.flash('error_eliminar','No se puede');
        //res.redirect('/image/'+image.filename);
        
    //}
    //console.log(req.user.email);
    if(image){
        if(image.email==req.user.email) {  
        
            await fs.unlink(path.resolve('./src/public/upload/'+image.filename));
            await Comment.deleteOne({image_id: image._id});
            await image.remove();
            res.json(true);
            
        }
            
            //req.flash('error_eliminar','No se puede');
            //res.redirect('/image/'+image.filename);
            
        
        
            //error_eliminar.push({text: 'Solo puedes borrar tus propios anuncios'});
            //req.flash('error_msg','Solo puedes borrar tus anuncios');
            //console.log('No se puede');
            //await req.flash('error_eliminar','No se puede');
            //res.redirect('/');
            //req.flash('error_eliminar', 'NO se puede');
        
    }
    
};

ctrl.filtro=async(req, res)=>{
    let filtrociudad=req.body.filtrociudad;
    
    const filtros = await Image.find({ciudad:filtrociudad}).lean({virtuals:true});
    let viewModel={filtros: []};
    viewModel.filtros=filtros;
    viewModel=await sidebar(viewModel);
    
    //res.json({likes: filtros.likes});
    res.render('filtrado', viewModel);
    
};

ctrl.maslike=async(req, res)=>{
   
    const maslikes=await Image.find().limit(6).sort({likes: -1}).lean({virtuals:true});

    let viewModel={maslikes: []};
    viewModel.maslikes=maslikes;
    console.log(maslikes);
    res.render('maslike', viewModel);
   
};

ctrl.mascomentados=async(req, res)=>{
   
    const maslikes=await Image.find().limit(6).sort({likes: -1}).lean({virtuals:true});

    let viewModel={maslikes: []};
    viewModel.maslikes=maslikes;
    console.log(maslikes);
    res.render('concursos', viewModel);
   
};

ctrl.misanuncios=async(req, res)=>{
    let correo=req.body.email;
    console.log(correo);
    const filtroemail = await Image.find({email:correo}).lean({virtuals:true});
    const prueba = await users.find({email:"brodriguezmarrugo@gmail.com"});
    
    let viewModel={filtroemail: []};
    viewModel.filtroemail=filtroemail;
    viewModel=await sidebar(viewModel);
    console.log(req.user.password);
    //res.json({likes: filtros.likes});
    res.render('misanuncios', viewModel);
    
};

/*ctrl.createanuncio= (req, res)=>{

    const saveImage=async()=>{
        const imgURL=randomNumber();
        const imagenes=await Image.find({filename: imgURL});
        if (imagenes.length>0){
            saveImage();
        }else{
            console.log(imgURL);
            const imageTempPath=req.file.path;
            const ext=path.extname(req.file.originalname).toLowerCase();
            const targetPath=path.resolve(`src/public/upload/${imgURL}${ext}`)
        
            if (ext==='.png'||ext==='.jpg'||ext==='.jpeg'||ext==='.gif'){
                await fs.rename(imageTempPath, targetPath);
                const newImg=new Image({
                name:req.body.name,
                raza:req.body.raza,
                ciudad:req.body.ciudad,
                filename:imgURL + ext,
                descripcion:req.body.descripcion
                });
                const imagenguardada=await newImg.save();
                res.redirect('/cargaranuncio/'+ imgURL);
                
            }else{
                await fs.unlink(imageTempPath);
                res.status(500).json({error: 'Solo se permiten imagenes'});
            }
            
        }
        

    };
    saveImage();
        
}
*/
module.exports=ctrl;
