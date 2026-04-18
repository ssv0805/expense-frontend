const Transaction = require("../models/transaction");


const addTransaction = async (req, res) => {
    try {
        const transaction = new Transaction({...req.body,user:req.user.email});
        const saved = await transaction.save();
        res.status(201).json(saved);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const getTransactions = async (req, res) => {
    try {
        const data = await Transaction.find({ user: req.user.email });
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    deleteTransaction
};