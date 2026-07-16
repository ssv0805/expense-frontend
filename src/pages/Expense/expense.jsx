import { useState, useEffect } from "react";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, setTransactions, deleteTransaction } from "../../features/transaction/transactionSlice"
import "./expense.css";
import Pagination from "../../components/Pagination";
import FilterDrawer from "../../components/Drawer";

function Expense() {
    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://expense-backend-porh.onrender.com";

    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allCategories, setAllCategories] = useState([]);
    const [unpaidBills, setUnpaidBills] = useState([]);
    const [selectedBillId, setSelectedBillId] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [tempCategory, setTempCategory] = useState("");
    const [tempMonth, setTempMonth] = useState("");
    const [tempType, setTempType] = useState("");
    const [tempSearch, setTempSearch] = useState("");

    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(7);
    const [total, setTotal] = useState(0);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const transactions = useSelector((state) => state.transaction);
    const expenses = Array.isArray(transactions) ? transactions : [];

    const predefinedPayments = ["Cash", "UPI", "Card", "Bank"];

    const dynamicPayments = expenses
        .map((exp) => exp.payment?.trim())
        .filter(Boolean)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

    const payments = [...new Set([...predefinedPayments, ...dynamicPayments])];

    const predefinedCategories = [
        "Food",
        "Shopping",
        "Travel",
        "Bills",
        "Entertainment",
        "Other",
    ];

    const categories = [...new Set([...predefinedCategories, ...allCategories])];

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        category: "",
        amount: "",
        payment: "",
        to: "",
    });

    const [categoryFilter, setCategoryFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    // ✅ FETCH CATEGORIES
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/transaction/categories`,
                    {
                        withCredentials: true,
                        params: { type: "expense" }
                    }
                );
                setAllCategories(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    // ✅ FETCH TRANSACTIONS
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
                            type: "expense",
                            month: monthFilter
                        },
                    }
                );

                dispatch(setTransactions(resp.data.data));
                setTotalPages(resp.data.totalPages);
                setTotal(resp.data.total);
            } catch (err) {
                console.log("EXPENSE FETCH ERROR:", err.response?.data || err.message);
            }
        };

        fetchTransactions();
    }, [currentUser, page, categoryFilter, limit, monthFilter, dispatch]);

    // ✅ FETCH BILLS (REUSABLE)
    const fetchBills = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/bills`,
                { withCredentials: true }
            );

            const unpaid = res.data.filter(
                bill => bill.status === "unpaid"
            );

            setUnpaidBills(unpaid);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // ✅ HANDLE CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;

        // reset bill if category changes
        if (name === "category" && value !== "Bills") {
            setSelectedBillId("");
        }

        if (name === "amount") {
            const cleanedValue = value.replace(/^0+(?=\d)/, "");
            setForm({ ...form, [name]: cleanedValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // ✅ DELETE
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/transaction/${id}`, {
                withCredentials: true
            });

            dispatch(deleteTransaction(id));
        } catch (err) {
            console.log(err);
            alert("Deletion failed");
        }
    };

    // ✅ SUBMIT
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
                res = await axios.put(
                    `${API_URL}/transaction/${editId}`,
                    {
                        ...form,
                        type: "expense",
                        billId: selectedBillId || null
                    },
                    { withCredentials: true }
                );

                dispatch(setTransactions(
                    transactions.map(t => t._id === editId ? res.data : t)
                ));

                alert("Expense updated successfully ✅");
            } else {
                res = await axios.post(
                    `${API_URL}/transaction`,
                    {
                        ...form,
                        type: "expense",
                        billId: selectedBillId || null
                    },
                    { withCredentials: true }
                );

                dispatch(addTransaction(res.data));
                alert("Expense added successfully!");
            }

            // ✅ RESET
            setForm({
                date: new Date().toISOString().split("T")[0],
                category: "",
                amount: "",
                payment: "",
                to: "",
            });

            setEditId(null);
            setSelectedBillId(""); // ✅ IMPORTANT
            setShowForm(false);

            await fetchBills(); // ✅ refresh bills

        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");

    return (
        <>
            <div className="expense-page">
                <div className="def">
                    <h2 className="expense-title">Expense Management</h2>

                    <div className="filters">
                        <button onClick={() => setDrawerOpen(true)} className="filter-toggle">
                            ☰ Filters
                        </button>

                        <button onClick={() => setShowForm(true)} className="add-btn">
                            + Add Expense
                        </button>
                    </div>
                </div>

                <FilterDrawer
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                    tempType={tempType}
                    setTempType={setTempType}
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

                <div className="expense-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>To</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {expenses.length > 0 ? (
                                expenses.map((exp) => (
                                    <tr key={exp._id}>
                                        <td>{formatDate(exp.date)}</td>
                                        <td>{exp.category}</td>
                                        <td style={{ color: "red" }}>Rs.{exp.amount}</td>
                                        <td>{exp.payment}</td>
                                        <td>{exp.to}</td>

                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => {
                                                    setForm({
                                                        date: exp.date.split("T")[0],
                                                        category: exp.category,
                                                        amount: exp.amount,
                                                        payment: exp.payment,
                                                        to: exp.to,
                                                    });

                                                    if (exp.billId) {
                                                        setSelectedBillId(exp.billId._id || exp.billId);
                                                    } else {
                                                        setSelectedBillId("");
                                                    }

                                                    setEditId(exp._id);
                                                    setShowForm(true);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="del-btn"
                                                onClick={() => {
                                                    if (window.confirm("Delete this expense?")) {
                                                        handleDelete(exp._id);
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
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No expense records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Add Expense</h3>

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
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    required
                                    disabled={!!selectedBillId}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    disabled={!!selectedBillId}
                                />

                                <select
                                    name="payment"
                                    value={form.payment}
                                    onChange={handleChange}
                                    disabled={!!selectedBillId}
                                >
                                    <option value="">Payment Method</option>
                                    {payments.map((pay, index) => (
                                        <option key={index} value={pay}>{pay}</option>
                                    ))}
                                </select>

                                {form.category === "Bills" && (
                                    <select
                                        value={selectedBillId}
                                        onChange={(e) => {
                                            const billId = e.target.value;
                                            setSelectedBillId(billId);

                                            const selectedBill = unpaidBills.find(
                                                bill => bill._id === billId
                                            );

                                            if (selectedBill) {
                                                setForm({
                                                    ...form,
                                                    to: selectedBill.name,
                                                    amount: selectedBill.amount,
                                                    payment: selectedBill.paymentMethod
                                                });
                                            }
                                        }}
                                    >
                                        <option value="">Select Bill</option>
                                        {unpaidBills.map((bill) => (
                                            <option key={bill._id} value={bill._id}>
                                                {bill.name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <input
                                    type="text"
                                    name="to"
                                    placeholder="Payment to / Bill name"
                                    value={form.to}
                                    onChange={handleChange}
                                    disabled={!!selectedBillId}
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

export default Expense;