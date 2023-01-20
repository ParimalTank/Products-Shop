const mongoose = require('mongoose');

// Created a Product Schema
const productSchema = mongoose.Schema({
   _id : mongoose.Schema.Types.ObjectId,

   name : { 
      type: String, 
      require: true 
   },     // adding require because of we can't add only one field at time of add products
   price : {
      type : Number , 
      require : true
   },
   productImage : { 
      type : String , 
      require : true
   }
});

module.exports = mongoose.model('Product' , productSchema);