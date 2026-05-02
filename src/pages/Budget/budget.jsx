import { useEffect, useState } from "react";
import axios from "axios";
import "../Expense/expense.css";

function Budget() {

    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://expense-backend-porh.onrender.com";

    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        category: "Food",
        amount: ""
    });

    // 🎨 CATEGORY COLORS + ICONS
    const categoryConfig = {
        Food: { color: "#fa8c16", bg: "#fff7e6", icon: "🍔" },
        Shopping: { color: "#722ed1", bg: "#f9f0ff", icon: "🛍️" },
        Transport: { color: "#52c41a", bg: "#f6ffed", icon: "🚗" },
        Entertainment: { color: "#eb2f96", bg: "#fff0f6", icon: "🎬" },
        Travel: { color: "#1890ff", bg: "#e6f7ff", icon: "✈️" },
        Other: { color: "#13c2c2", bg: "#e6fffb", icon: "📦" },
        Health: { color: "#db78e9", bg: "#fdecff", icon: "👩‍⚕️" },
        Bills: { color: "#04947e", bg: "#dffffa", icon: "💵" },
        Education: { color: "#3b0624", bg: "#fafaf4", icon: "👩‍🎓" },
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

        await axios.post(`${API_URL}/api/budget`, form, {
            withCredentials: true
        });

        setForm({ category: "Food", amount: "" });
        setShowForm(false);
        fetchData();
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

    return (
        <div className="expense-page">
            <div className="def">

                <h2 className="expense-title">Budget Management</h2>

                {/* ADD BUTTON */}
                <button className="add-btn" style={{ marginBottom: "7px" }} onClick={() => setShowForm(true)}>
                    + Add Budget
                </button>
            </div>

            {/* CARDS */}
            <div className="cards" >

                {budgets.map((b) => {

                    const config = categoryConfig[b.category] || categoryConfig["Other"];

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
                            <h3>Add Budget</h3>

                            <form onSubmit={handleSubmit} className="expense-form">

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    <option>Food</option>
                                    <option>Shopping</option>
                                    <option>Transport</option>
                                    <option>Entertainment</option>
                                    <option>Travel</option>
                                    <option>Health</option>
                                    <option>Education</option>
                                    <option>Bills</option>
                                    <option>Other</option>
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