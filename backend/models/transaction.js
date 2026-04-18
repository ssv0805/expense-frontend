const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"], 
        required: true
    },
    category: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment: String,   
    source: String,   
    to: String,       
    user: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);