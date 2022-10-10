
const mongoose=require('mongoose');
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
/*const { get } = require('moongose/routes');*/
const path=require('path');

const { Schema }=mongoose;

const ImageSchema = new Schema(
    {
    email: {type: String},
    nameuser: {type: String},
    name: {type: String},
    raza: {type:String},
    descripcion: {type: String},
    ciudad:{type: String},
    tipo:{type: String},
    contacto:{type: String},
    filename: {type: String},
    vistas: {type:Number, default:0},
    likes: {type:Number, default:0},
    timestamp: {type:Date, default:Date.now}
    },
    {
        versionKey: false,
        timestamps: true,
    }
    
    );


 
ImageSchema.virtual('uniqueId').get(function(){
        return this.filename.replace(path.extname(this.filename), '');
    });
        
ImageSchema.plugin(mongooseLeanVirtuals);

module.exports=mongoose.model('Image', ImageSchema);
