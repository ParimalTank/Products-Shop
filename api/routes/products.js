const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

// used for storing product image file
const multer = require('multer');

// for store file with their original file name and file type
const storage = multer.diskStorage({
   destination : function(req, file , cb){
    cb(null , './upload/')
   },
   filename: function(req, file , cb){
    cb(null , new Date().toISOString() + file.originalname);
   }
   
})

// middleware to allow specific type of file input
const fileFilter = function(req, file , cb){
  if(file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png'){
    cb(null , true);
  }else{
    cb(null , false);
  }
}


const upload = multer({
    storage : storage , 
    limits : {
    fieldSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
})

// Get all Product
router.get("/", ProductController.get_all_product);


// Add Product

router.post("/", checkAuth , upload.single('productImage') , ProductController.product_add);


// get Product By ID
router.get("/:productId", ProductController.get_product_by_id);

// Update Product by ID
router.patch("/:productId",  checkAuth ,  ProductController.product_update);

// Delete Product By
router.delete("/:productId", checkAuth, ProductController.product_delete);

module.exports = router;
