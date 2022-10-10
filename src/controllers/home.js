const ctrl={};

const { Image }= require('../models');
const sidebar=require('../helpers/sidebar');
const User=require('../models/users');
const { isAuthenticated } = require('../helpers/auth');
const usuario=require('../server/config');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

//console.log(usuario);

ctrl.index = async (req, res)=>{
   
   
   const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   /*const filtros = await Image.find({ciudad:'Cartagena'}).lean();*/
   let viewModel={images: []};
   viewModel.images=images;
   //viewModel=await sidebar(viewModel);
   res.render('index', viewModel);
};

ctrl.indexcargar = async(req, res)=>{
   const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   
   let viewModel={images: []};
   viewModel.images=images;
   //viewModel=await sidebar(viewModel);
   res.render('cargaranuncio', viewModel);
};

ctrl.ingresar = async (req, res)=>{
   const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   /*const filtros = await Image.find({ciudad:'Cartagena'}).lean();*/
   let viewModel={images: []};
   /*let viewModel={filtros: []};*/
   viewModel.images=images;
   /*viewModel.filtros=filtros;*/
   
   //viewModel=await sidebar(viewModel);
   //console.log(images);
   
   res.render('signin', viewModel);
};

ctrl.registrar = async (req, res)=>{
   const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   /*const filtros = await Image.find({ciudad:'Cartagena'}).lean();*/
   let viewModel={images: []};
   /*let viewModel={filtros: []};*/
   viewModel.images=images;
   /*viewModel.filtros=filtros;*/
   
   //viewModel=await sidebar(viewModel);
   //console.log(images);
   
   res.render('signup', viewModel);
};

ctrl.salir = async (req, res)=>{
   
   req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
};



ctrl.registrardos = async (req, res)=>{
   const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   
   let viewModel={images: []};
   
   viewModel.images=images;
   
   
   //viewModel=await sidebar(viewModel);
   const {name, email, password, cpassword}=req.body;
   const errors=[];
   if (name.length<=0){
      errors.push({text: 'Debe colocar un nombre'});
   }
   if (email.length<=0){
      errors.push({text: 'Debe colocar un email'});
   }
   if (password!=cpassword){
      errors.push({text:'Las contraseñas no coinciden'});
   }
   if (password.length<6){
      errors.push({text:'La contraseña debe tener al menos 6 caracteres'});
   }
   if (errors.length>0){
      res.render('signup', {errors, name, email, password, cpassword});
   }else{
      const emailUser=await User.findOne({email: email});
      if(emailUser){
         req.flash('error_msg','El email ya está en uso');
         res.redirect('/users/signup');
      }   
      const newUser=new User({name, email, password})
      newUser.password=await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'Estas registrado');
      res.redirect('/users/signin');
   }

   //res.render('signup', viewModel);
};

ctrl.misanuncios = async (req, res)=>{
   //const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   //let viewModel={images: []};
   let viewModel=[];
   //viewModel.images=images;
   
   //viewModel=await sidebar(viewModel);
   
   res.render('misanuncios', viewModel);
};

ctrl.olvidarcontra = async (req, res)=>{
   //const images = await Image.find().sort({timestamp: -1}).lean({virtuals:true});
   //let viewModel={images: []};
   let viewModel=[];
   //viewModel.images=images;
   
   //viewModel=await sidebar(viewModel);
   
   res.render('forgotpassword', viewModel);
};

ctrl.reset = async (req, res, next)=>{
   
   
   const {email, token}=req.params;
   //res.send(req.params);
   //const prueba=email;
   res.locals.prueba=email;
   console.log(email);
   const pass = await User.findOne({email:email});
   const secret=process.env.JWT_SECRET + pass.password;

   try {
      const payload=jwt.verify(token, secret);
      res.render('resetpassword', {email: pass.email});
   } catch (error) {
      console.log(error.message);
      res.send(error.message);
   }
   //res.render('resetpassword', email,token);
};

ctrl.resetdos = async (req, res, next)=>{
   
   const {resetpass, emailpassword}=req.body;
  
   
   
   console.log(emailpassword);
   console.log(resetpass);
   const salt=await bcrypt.genSalt(10);
   const password=await bcrypt.hash(resetpass,salt);
   
   const userpassword= await User.updateOne({email:emailpassword},{password:password},{new:true});

   //res.redirect('/users/signin');


   res.send('hola mundo');
   
};



ctrl.updatedpass = async (req, res, next)=>{
   const {email, token}=req.params;

   const {resetpass}=req.body;
   //const salt=await bcrypt.genSalt(10);
   //const password=await bcrypt.hash(resetpass,salt);
   //console.log(email);
   //const userpassword= await User.updateOne({email:email},{password:password},{new:true});

   //const {encrip}=resetpass.encryptPassword();
   //return hash;
   //console.log(encrip);
   //const passupdated=await User.updateOne({email:'brodriguezmarrugo@gmail.com'},);
   //const result=await User.findOneAndUpdate({email:'brodriguezmarrugo@gmail.com'},{password:hash});
   //passupdated.password=resetpass;
   //await passupdated.save();
   //console.log(result);
   
   
   
   //res.send(User);
   res.redirect('/users/signin');
};



ctrl.olvidarcontrados = async (req, res, next)=>{
   //const JWT_SECRET='some super secret...';
   const {emailpass}=req.body;
   const pass = await User.findOne({email:emailpass});
   //console.log(emailpass);
   //console.log(pass.password);
   if (pass){
      //res.send('Usuario encontrado');
      const secret=process.env.JWT_SECRET + pass.password;
      const payload={
         email: pass.email
         
      }
      const token= jwt.sign(payload, secret, {expiresIn: '15m'});
      const link=`http://localhost:3000/users/resetpassword/${pass.email}/${token}`;
      //const link=`http://localhost:3000/users/resetpassword/${token}`;
      
      console.log(link);
      //console.log(pass.email,token);
      res.send('password enviado');
      //res.render('resetpassword', pass);
      //return;
   }else{
      res.send('No existe en la BD');
      return;
   }
   
   
   
   //res.render('forgotpassword', emailpass);
};

module.exports=ctrl;
