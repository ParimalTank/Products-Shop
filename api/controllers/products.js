const mongoose = require('mongoose');
const Product = require("../models/product");

// GET ALL PRODUCT
exports.get_all_product = (req, res, next) => {
    Product.find()
      .select("name price _id productImage")
      .exec()      // exec() method used for match a string
      .then(result => {
     
      const responce = {
          count : result.length,
          products: result.map(result =>{
              return{
                _id : result._id, 
                  name: result.name,
                  price: result.price,
                  productImage :  result.productImage,
                  request : {   
                      type : 'GET',
                      url : 'http://localhost:3000/products/' + result._id
                  }
              }
          })
      }
        // check that number of Product in the database
        if (responce.count > 0 ) {
          console.log(responce);
          res.status(200).json(responce);
        } else {
          res.status(404).json({ message: "Not Any Product Available" });
        }
      })
      .catch((err) => {
        res.status(505).json({ error: err });
      });
  
  }

// PRODUCT ADD
  exports.product_add = (req, res, next) => {
    console.log(req.file);
  
    // Create Object
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage : req.file.path
    });
  
    // Save Products into a Database
    product
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Product Created Successfully",
          createdProduct: product,
        });
      })
      .catch((err) => console.log(err));
  }

// GET PRODUCT BY ID
  exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId;
  
   
    Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then((result) => {
        console.log("From DataBase", result);
  
        // id should be not null
        if (result) {
          res.status(200).json({
              product : result,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/products'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No Valid Entry Found For Provided ID" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  
  }

// PRODUCT UPDATE BY ID
  exports.product_update = function (req, res, next) {

    const id = req.params.productId;
    
    // Set id Default Attribute of Mongodb to set Updated Value
    Product.updateOne({ _id : id} , { $set : req.body})
    .exec()
    .then(result =>{
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
         error : err
      })
    })
    
 }

 // DELETE PRODUCT
 exports.product_delete = function (req, res, next) {
  const id = req.params.productId;

  Product.deleteOne({_id: id})
  .exec()
  .then( result =>{
      console.log('Succsessfull Deleted'  , result);
      res.status(200).json({
        message: 'Product deleted',
        request : {
           type: 'POST',
           url: 'http://localhost:3000/products',
           body: { name: 'String' , price: 'Number'}
        }
      });
  })
  .catch( (err) => {
       console.log(err);
       res.status(505).json({error : err})
  })

}