const mongoose = require('mongoose');
const appManage=new mongoose.Schema({
    appname:{type:String},
    applink:{type:String},
    appicon:{type:String}

})

const appmodel=mongoose.model('appdata',appManage);
module.exports=appmodel;