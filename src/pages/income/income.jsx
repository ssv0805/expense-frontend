import { useState, useEffect } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setTransactions,
    addTransaction,
    deleteTransaction
} from "../../features/transaction/transactionSlice";
import "../Expense/expense.css";
import Pagination from '../../components/Pagination';
import FilterDrawer from "../../components/Drawer";

function Income() {

    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://trackify-backend-3kys.onrender.com";

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(7);

    // Edit mode
    const [editId, setEditId] = useState(null);

    // drawer
    const [drawerOpen, setDrawerOpen] = useState(false);

    // temp filters
    const [tempCategory, setTempCategory] = useState("");
    const [tempMonth, setTempMonth] = useState("");
    const [tempSearch, setTempSearch] = useState("");

    // applied filters
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(7);
    const [total, setTotal] = useState(0);
    const [allCategories, setAllCategories] = useState([]);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const transactions = useSelector((state) => state.transaction);

    const incomes = Array.isArray(transactions) ? transactions : [];
    

    const predefinedCategories = [
        "Salary", "Reward", "Bonus", "Friend", "Other"
    ];

    const dynamicCategories = incomes
        .map((inc) => inc.category?.trim())
        .filter(Boolean);

    const categories = [
    ...new Set([...predefinedCategories, ...allCategories])
];

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        category: "",
        source: "",
        amount: ""
    });

    const [categoryFilter, setCategoryFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    // FETCH

        useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/transaction/categories`,
                {
                    withCredentials: true,
                    params: { type: "income" }
                }
            );

            setAllCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchCategories();
}, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                if (!currentUser?.email) return;

                const resp = await axios.get(
                    `${API_URL}/transaction`,
                    {
                        withCredentials: true,
                        params: {
                            page,
                            limit,
                            category: categoryFilter,
                            type: "income",
                            month: monthFilter
                        }
                    }
                );

                dispatch(setTransactions(resp.data.data));
                setTotalPages(resp.data.totalPages);
                setTotal(resp.data.total)
            } catch (err) {
                console.log("FETCH ERROR:", err.response?.data || err.message);
            }
        };

        fetchTransactions();
    }, [currentUser, page, categoryFilter, limit, monthFilter, dispatch]);

    // INPUT CHANGE
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // DELETE
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

    // SUBMIT (ADD + EDIT)
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
            let res;

            if (editId) {
                // UPDATE
                res = await axios.put(
                    `${API_URL}/transaction/${editId}`,
                    { ...form, type: "income" },
                    { withCredentials: true }
                );

                dispatch(setTransactions(
                    transactions.map(t => t._id === editId ? res.data : t)
                ));

                alert("Income updated successfully ✅");

            } else {
                // CREATE
                res = await axios.post(
                    `${API_URL}/transaction`,
                    { ...form, type: "income" },
                    { withCredentials: true }
                );

                dispatch(addTransaction(res.data));

                alert("Income added successfully ✅");
            }

            // RESET
            setForm({
                date: new Date().toISOString().split("T")[0],
                category: "",
                source: "",
                amount: ""
            });

            setEditId(null);
            setShowForm(false);

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
            alert("Something went wrong");
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");

    return (
        <>
            <div className="expense-page">

                <div className="def">
                    <h2 className="expense-title">Income Management</h2>

                    <div className="filters">
                        <button onClick={() => setDrawerOpen(true)} className="filter-toggle">
                            ☰ Filters
                        </button>

                        <button onClick={() => {
                            setEditId(null);
                            setShowForm(true);
                        }} className="add-btn">
                            + Add Income
                        </button>
                    </div>
                </div>

                {/* FILTER DRAWER */}
                <FilterDrawer
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                    tempCategory={tempCategory}
                    setTempCategory={setTempCategory}
                    tempMonth={tempMonth}
                    setTempMonth={setTempMonth}
                    tempSearch={tempSearch}
                    setTempSearch={setTempSearch}
                    categories={categories}

                    onApply={() => {
                        setCategoryFilter(tempCategory);
                        setMonthFilter(tempMonth);
                        setSearch(tempSearch);
                        setDrawerOpen(false);
                        setPage(1);
                    }}

                    onReset={() => {
                        setTempCategory("");
                        setTempMonth("");
                        setTempSearch("");
                        setCategoryFilter("");
                        setMonthFilter("");
                        setSearch("");
                    }}

                    showType={false}
                />

                {/* TABLE */}
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
                            {incomes.length > 0 ? (
                                incomes.map((inc) => (
                                    <tr key={inc._id}>
                                        <td>{formatDate(inc.date)}</td>
                                        <td>{inc.category}</td>
                                        <td>{inc.source}</td>
                                        <td style={{ color: "green" }}>
                                            Rs.{inc.amount}
                                        </td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setForm({
                                                        date: inc.date.split("T")[0],
                                                        category: inc.category,
                                                        source: inc.source,
                                                        amount: inc.amount,
                                                    });
                                                    setEditId(inc._id);
                                                    setShowForm(true);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="del-btn"
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

                {/* MODAL */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>{editId ? "Edit Income" : "Add Income"}</h3>

                            <form onSubmit={handleSubmit} className="expense-form">

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    max={new Date().toISOString().split("T")[0]}
                                    onChange={handleChange}
                                    required
                                />

                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
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
                                    <button type="submit">
                                        {editId ? "Update" : "Save"}
                                    </button>

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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                limit={limit}
                setLimit={setLimit}
                total={total}
            />
        </>
    );
}

export default Income;