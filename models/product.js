const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    content: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        // required: true
    },
    password: {
        type: Number,
        // require: true
    },
    productImage:{
        type: String,
        // required: true
    } ,
    createdAt : {
        type: String,
    }
    

})
// , {timestamps: true});


ProductSchema.virtual('productId').get(function () {
    return this._id.toHexString();
});
ProductSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Product", ProductSchema);