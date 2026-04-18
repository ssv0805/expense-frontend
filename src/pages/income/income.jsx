import { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setTransactions,
    addTransaction,
    deleteTransaction
} from "../../features/transaction/transactionSlice";
import "../Expense/expense.css"


function Income() {
    const API_URL = "https://expense-backend-porh.onrender.com"
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemPerPage] = useState(7);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const transactions = useSelector((state) => state.transaction);

    const incomes = transactions.filter(
        (t) => t.user === currentUser?.email && t.type === "income"
    );

    const predefinedCategories = [
        "Salary",
        "Reward",
        "Bonus",
        "Friend",
        "Other"
    ];

    const dynamicCategories = incomes
        .map((inc) => inc.category?.trim())
        .filter(Boolean);

    const categories = [
        ...new Set([...predefinedCategories, ...dynamicCategories])
    ];
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        category1: "",
        source: "",
        amount: ""
    });

    const [categoryFilter, setCategoryFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");


    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                if (!currentUser?.email) return;

                const resp = await axios.get(
                    `${API_URL}/transaction`,
                    {
                        withCredentials: true,
                    }
                );

                //console.log("INCOME PAGE FETCH:", resp.data);
                dispatch(setTransactions(resp.data));
            } catch (err) {
                console.log("INCOME FETCH ERROR:", err.response?.data || err.message);
            }
        };

        fetchTransactions();
    }, [currentUser, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/transaction/${id}`, {
                withCredentials: true
            });

            dispatch(deleteTransaction(id));
            alert("Income deleted successfully!");
        } catch (err) {
            console.log("DELETE ERROR:", err.response?.data || err.message);
            alert("Delete failed");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.date > new Date().toISOString().split("T")[0]) {
            alert("Future dates are not allowed!");
            return;
        }

        if (!form.amount || Number(form.amount) <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/transaction`,
                {
                    ...form,
                    category: form.category1,
                    type: "income",
                    user: currentUser?.email
                },
                {
                    withCredentials: true
                }
            );

            console.log("ADDED INCOME:", res.data);

            dispatch(addTransaction(res.data));

            setForm({
                date: new Date().toISOString().split("T")[0],
                category1: "",
                source: "",
                amount: ""
            });

            setShowForm(false);

            alert("Income added successfully!");
        } catch (err) {
            console.log("ADD ERROR:", err.response?.data || err.message);
            alert("Error saving income!");
        }
    };

    const filteredIncomes = incomes.filter((inc) => {
        const month = new Date(inc.date).getMonth() + 1;

        const monthMatch = monthFilter
            ? month === Number(monthFilter)
            : true;

        const categoryMatch = categoryFilter
            ? (inc.category || "").toLowerCase() === categoryFilter.toLowerCase()
            : true;

        return monthMatch && categoryMatch;
    });



    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedIncomes = filteredIncomes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);

    function renderPaginationControls() {
        return (
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={currentPage === i + 1 ? "active-page" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
        );
    }

    return (
        <div className="expense-page">
            <h2 className="expense-title">Income Management</h2>

            <div className="filters">
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <select onChange={(e) => setMonthFilter(e.target.value)} value={monthFilter}>
                    <option value="">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                <button onClick={() => setShowForm(true)} className="add-btn">
                    + Add Income
                </button>
            </div>

            <div className="expense-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Source</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedIncomes.length > 0 ? (
                            paginatedIncomes.map((inc) => (
                                <tr key={inc._id}>
                                    <td>{formatDate(inc.date)}</td>
                                    <td>{inc.category}</td>
                                    <td>{inc.source}</td>
                                    <td style={{ color: "rgb(0,128,0)" }}>Rs.{inc.amount}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => {
                                                if (window.confirm("Delete this income?")) {
                                                    handleDelete(inc._id);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No income records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {renderPaginationControls()}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Add Income</h3>
                        <form onSubmit={handleSubmit} className="expense-form">
                            <input
                                type="date"
                                name="date"
                                max={new Date().toISOString().split("T")[0]}
                                value={form.date}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="category1"
                                value={form.category1}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="source"
                                placeholder="Income Source"
                                value={form.source}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />

                            <div className="modal-buttons">
                                <button type="submit">Save</button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Income;