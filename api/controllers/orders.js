const mongoose = require('mongoose');

// models
const Order = require("../models/order");
const Product = require("../models/product");

// GET ALL ORDERS
exports.orders_get_all = (req, res, next) => {
    Order.find()
      .select("product quantity _id")   // only selected responce product , quantity , _id
      .populate('product')  // Order with product details
      .exec()       // exec() method used for match a string
      .then((result) => {
        res.status(200).json({
          // count Number of Orders
          count: result.length,
  
          // Returns The Orders Filed
          orders: result.map((result) => {
            return {
              _id: result._id,
              product: result.product,
              quantity: result.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id,
              },
            };
          }),
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

// ADD ORDERS
exports.orders_create_order = (req, res, next) => {
  
    // find a valid product Id
   Product.findOne({ _id: req.body.productId })
     .then((product) => {
      
       // if product not found return 404
       if (!product) {
         return res.status(404).json({
           message: "Product not found",
         });
       }
 
       //creating a Order
       const order = new Order({
         _id: mongoose.Types.ObjectId(),
         quantity: req.body.quantity,
         product: req.body.productId,
       });
       return order.save();
     })
     .then((result) => {
 
     //   console.log(result);
 
       res.status(201).json({
         message: "Order stored",
         createdOrder: {
           _id: result._id,
           product: result.product,
           quantity: result.quantity,
         },
         request: {
           // information about the request
           type: "GET",
           url: "http://localhost:3000/orders/" + result._id,
         },
       });
     })
     .catch((err) => {
       res.status(500).json({
         error: err,
       });
     });
 }

// ORDERS UPDATES
 exports.orders_update = function (req, res, next) {

    const id = req.params.orderId;
    
    // Set id Default Attribute of Mongodb to set Updated Value
    Order.updateOne({ _id : id} , { $set : req.body})
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

// FIND ORDER BY SPACIFIC ID
 exports.orders_get_by_id =  (req, res, next) => {
    const id = req.params.orderId;
  
    Order.findById({ _id: id })
      .exec()
      .populate('product')  // Order with product details
      .then((order) => {
        res.status(200).json({
          order: order,
          result: {
            type: "GET",
            url: "localhost:3000/orders",
          },
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

// DELETE ORDER 
exports.orders_deletes = function (req, res, next) {
    const id = req.params.orderId;
  
    Order.deleteOne({ _id: id })
      .then((order) => {
        if (!order) {
          res.status(404).json({
            message: "Order Not Found!",
          });
        }
  
        res.status(200).json({
          message: "Order Deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/orders",
            body: { productId: "ID", quantity: "NUmber" },
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }