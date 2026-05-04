import { useEffect, useState } from "react";
import axios from "axios";
import "../Expense/expense.css";
import { Pencil } from 'lucide-react';

function Budget() {

    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://trackify-backend-3kys.onrender.com";

    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        category: "Food",
        amount: ""
    });

    // 🎨 CATEGORY COLORS + ICONS
    const colorPalette = [
        "#7C3AED",
        "#DC2626",
        "#2563EB",
        "#059669",
        "#D97706",
        "#DB2777",
        "#0891B2",
        "#4F46E5",
        "#9333EA",
        "#EA580C",
        "#15803D",
        "#BE123C",
        "#0369A1",
        "#4338CA",
        "#166534",
        "#854D0E",
        "#9F1239",
        "#0F766E",
        "#1D4ED8",
        "#7E22CE"
    ];

    const categoryColors = {};

    const getCategoryStyle = (category) => {
        const iconMap = {
            food: "🍔",
            shopping: "🛍️",
            transport: "🚗",
            entertainment: "🎬",
            travel: "✈️",
            health: "💊",
            bills: "💵",
            education: "📚",
            groceries: "🛒",
            rent: "🏠",
            gym: "🏋️",
            salary: "💼",
            savings: "🏦",
            investment: "📈",
            emergency: "🚨",
            other: "💰"
        };

        // Assign unique color if category is new
        if (!categoryColors[category]) {
            const usedColors = Object.values(categoryColors);
            const availableColors = colorPalette.filter(
                color => !usedColors.includes(color)
            );

            categoryColors[category] =
                availableColors.length > 0
                    ? availableColors[0]
                    : colorPalette[
                    Object.keys(categoryColors).length % colorPalette.length
                    ];
        }

        const color = categoryColors[category];
        const bg = `${color}20`;

        const lowerCategory = category.toLowerCase();

        const icon =
            iconMap[lowerCategory] ||
            iconMap[
            Object.keys(iconMap).find((key) =>
                lowerCategory.includes(key)
            )
            ] ||
            "💰";

        return {
            color,
            bg,
            icon
        };
    };


    useEffect(() => {
        if (!showForm) {
            fetchData();
        }


    }, []);
    const fetchData = async () => {
        try {
            setLoading(true);

            const [bRes, tRes] = await Promise.all([
                axios.get(`${API_URL}/api/budget`, { withCredentials: true }),
                axios.get(`${API_URL}/transaction/all`, {
                    withCredentials: true,

                })
            ]);

            setBudgets(bRes.data);
            setTransactions(tRes.data.data || tRes.data); // safe fallback

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }




    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `${API_URL}/api/budget/${editingId}`,
                    { amount: form.amount },
                    { withCredentials: true }
                );

                alert("Budget updated successfully ✅");
            } else {
                await axios.post(
                    `${API_URL}/api/budget`,
                    form,
                    { withCredentials: true }
                );

                alert("Budget added successfully ✅");
            }

            setForm({
                category: "Food",
                amount: ""
            });

            setEditingId(null);
            setShowForm(false);
            fetchData();

        } catch (err) {
            if (err.response?.status === 400) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong!");
                console.log(err);
            }
        }
    };

    const deleteBudget = async (id) => {
        await axios.delete(`${API_URL}/api/budget/${id}`, {
            withCredentials: true
        });
        fetchData();
    };

    // ✅ AUTO SPENT CALCULATION
    const getSpent = (category) => {
        const now = new Date();

        return transactions
            .filter(t =>
                t.type === "expense" &&
                t.category === category &&
                new Date(t.date).getMonth() === now.getMonth() &&
                new Date(t.date).getFullYear() === now.getFullYear()
            )
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const handleEditByCategory = (category) => {
        const selectedBudget = budgets.find(
            (budget) => budget.category === category
        );

        if (!selectedBudget) {
            alert("Budget not found");
            return;
        }

        setForm({
            category: selectedBudget.category,
            amount: selectedBudget.amount
        });

        setEditingId(selectedBudget._id);
    };

    return (
        <div className="expense-page">
            <div className="def">

                <h2 className="expense-title">Budget Management</h2>

                {/* ADD BUTTON */}
                <div className="filters" style={{ gap: "5px" }}>
                    <button
                        className="add-btn" style={{ marginBottom: "7px" }}
                        onClick={() => {
                            setIsEditMode(true);

                            if (budgets.length > 0) {
                                handleEditByCategory(budgets[0].category);
                            }

                            setShowForm(true);
                        }}
                    >
                        <Pencil size={12} /> Edit
                    </button>

                    <button
                        className="add-btn" style={{ marginBottom: "7px" }}
                        onClick={() => {
                            setIsEditMode(false);
                            setEditingId(null);
                            setForm({
                                category: "Food",
                                amount: ""
                            });
                            setShowForm(true);
                        }}
                    >
                        + Add Budget
                    </button>

                </div>
            </div>

            {/* CARDS */}
            <div className="cards" >

                {budgets.map((b) => {

                    const config = getCategoryStyle(b.category);

                    const spent = getSpent(b.category);
                    const remaining = b.amount - spent;
                    const percent = Math.min((spent / b.amount) * 100, 100);

                    return (
                        <div className="budget-card" key={b._id}>

                            {/* HEADER */}
                            <div className="budget-card-header">
                                <div className="abcd">
                                    <div
                                        className="budget-icon"
                                        style={{ background: config.bg, color: config.color }}
                                    >
                                        {config.icon}
                                    </div>

                                    <h3>{b.category}</h3>

                                </div>
                                <div
                                    className="budget-percent"
                                    style={{ background: config.bg, color: config.color }}
                                >
                                    {Math.round(percent)}%
                                </div>
                            </div>

                            {/* PROGRESS */}
                            <div className="budget-progress">
                                <div
                                    className="budget-progress-fill"
                                    style={{
                                        width: `${percent}%`,
                                        background: config.color
                                    }}
                                />
                            </div>

                            {/* VALUES */}
                            <div className="budget-values">

                                <div>
                                    <p style={{ color: config.color }}>₹{spent}</p>
                                    <span>Used</span>
                                </div>

                                <div className="divider-vertical" />

                                <div>
                                    <p style={{ color: config.color }}>₹{remaining}</p>
                                    <span>Remaining</span>
                                </div>

                            </div>

                            <div className="divider-horizontal" />

                            <div className="budget-total">
                                <span>Total Budget</span>
                                <span>₹{b.amount}</span>
                            </div>
                            <div className="budget-footer">

                                <div>
                                    {percent > 80 && percent <= 100 && (
                                        <p className="warning-text">Warning: 80% used</p>
                                    )}

                                    {percent > 100 && (
                                        <p className="error-text">Budget Exceeded!</p>
                                    )}
                                </div>
                                <button
                                    className="delete-btn"

                                    onClick={() => {
                                        if (window.confirm("Delete this Budget?")) {
                                            deleteBudget(b._id)
                                            //dispatch(deleteExpense(exp._id));
                                            setTimeout(() => {
                                                alert("Budget deleted successfully ✅");
                                            }, 300);

                                        }
                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    );
                })}
            </div>

            {/* MODAL FORM */}
            {
                showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>{editingId ? "Edit Budget" : "Add Budget"}</h3>

                            <form onSubmit={handleSubmit} className="expense-form">

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={(e) => {
                                        if (isEditMode) {
                                            handleEditByCategory(e.target.value);
                                        } else {
                                            handleChange(e);
                                        }
                                    }}
                                >
                                    {isEditMode
                                        ? budgets.map((budget) => (
                                            <option key={budget._id} value={budget.category}>
                                                {budget.category}
                                            </option>
                                        ))
                                        : (
                                            <>
                                                <option>Food</option>
                                                <option>Shopping</option>
                                                <option>Transport</option>
                                                <option>Entertainment</option>
                                                <option>Travel</option>
                                                <option>Health</option>
                                                <option>Education</option>
                                                <option>Bills</option>
                                                <option>Other</option>
                                            </>
                                        )}
                                </select>

                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Enter amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="modal-buttons">
                                    <button type="submit">Save Budget</button>

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }

        </div>
    );
}

export default Budget;