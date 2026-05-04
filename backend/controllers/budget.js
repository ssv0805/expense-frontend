const Budget = require("../models/budget");

// ➕ ADD BUDGET
const addBudget = async (req, res) => {
    try {
        const { category, amount } = req.body;

        const now = new Date();
        const month = now.toLocaleString("default", { month: "long" });
        const year = now.getFullYear();

        // Check if budget already exists
        const existingBudget = await Budget.findOne({
            user: req.user.email,
            category,
            month,
            year
        });

        if (existingBudget) {
            return res.status(400).json({
                message: `Budget for ${category} already exists this month`
            });
        }

        const budget = new Budget({
            user: req.user.email,
            category,
            amount,
            month,
            year
        });

        const saved = await budget.save();
        res.status(201).json(saved);

    } catch (err) {
        res.status(500).json(err);
    }
};

// 📥 GET BUDGETS
const getBudgets = async (req, res) => {
    try {
        const now = new Date();
        const month = now.toLocaleString("default", { month: "long" });
        const year = now.getFullYear();

        const budgets = await Budget.find({
            user: req.user.email,
            month,
            year
        });

        res.json(budgets);
    } catch (err) {
        res.status(500).json(err);
    }
};

// ✏️ UPDATE
const updateBudget = async (req, res) => {
    try {
        const { amount } = req.body;

        const updated = await Budget.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.email
            },
            { amount },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.json(updated);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ❌ DELETE
const deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget
};