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
    } 
}, {timestamps: true});

module.exports = mongoose.model("Product", ProductSchema);