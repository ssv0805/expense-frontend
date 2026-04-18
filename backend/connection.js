const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/expense-tracker");
        console.log("MongoDB connected");
    } catch (err) {
        console.log("Failed to connect", err);
        process.exit(1);
    }
};

module.exports = connect;