const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://root:${process.env.MONGO_ATLAS_PW}@product-shop-rest-api.ji5t4ee.mongodb.net/productShop` ,()=>
{
    useMongoClient : true ,
    console.log("MongoDB Connected Succsessfully");
}
);