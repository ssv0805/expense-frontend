import { useState, useEffect } from "react";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, setTransactions, deleteTransaction } from "../../features/transaction/transactionSlice"
//import { addExpense, deleteExpense } from "../../features/expense/expenseSlice";
import "./expense.css";

function Expense() {
    //const sessionId = localStorage.getItem("sessionId");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(7);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    //const expenses = useSelector((state) => state.expense).filter(
    // (exp) => exp.user === currentUser?.email
    //);
    const transactions = useSelector((state) => state.transaction);

    const expenses = transactions.filter(
        (t) => t.user === currentUser?.email && t.type === "expense"
    );

    const predefinedPayments = [
        "Cash",
        "UPI",
        "Card",
        "Bank"
    ];


    const dynamicPayments = expenses
        .map((exp) => exp.payment?.trim())
        .filter(Boolean)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

    const payments = [
        ...new Set([...predefinedPayments, ...dynamicPayments])
    ];

    const predefinedCategories = [
        "Food",
        "Shopping",
        "Travel",
        "Bills",
        "Entertainment",
        "Other",
    ];

    const dynamicCategories = expenses
        .map((exp) => exp.category?.trim())
        .filter(Boolean);

    const categories = [
        ...new Set([...predefinedCategories, ...dynamicCategories])
    ];

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

                //console.log("EXPENSE PAGE FETCH:", resp.data);
                dispatch(setTransactions(resp.data));
            } catch (err) {
                console.log("EXPENSE FETCH ERROR:", err.response?.data || err.message);
            }
        };

        fetchTransactions();
    }, [currentUser, dispatch]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "amount") {
            const cleanedValue = value.replace(/^0+(?=\d)/, "");

            setForm({ ...form, [name]: cleanedValue });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/transaction/${id}`,
                {
                    withCredentials: true

                }
            )

            dispatch(deleteTransaction(id))
        }
        catch (err) {
            console.log(err);
            alert("Deletion failed")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //const selectedDate = new Date(form.date);
        //const today = new Date();
        //today.setHours(0, 0, 0, 0);

        if (form.date > new Date().toISOString().split("T")[0]) {
            alert("Future dates are not allowed!");
            return;
        }
        if (!form.amount || Number(form.amount) <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        try {
            
            const res = await axios.post(`${API_URL}/transaction`, {
                ...form,
                category: form.category,
                type: "expense",
                //user: currentUser?.email
            },
                {
                    withCredentials: true
                })

            dispatch(
                addTransaction(res.data)
            );

            setForm({
                date: "",
                category: "",
                amount: "",
                payment: "",
                to: "",
            });

            setShowForm(false);
        }
        catch (err) {
            console.log(err)
            alert("Error saving Expense!")
        }
    }

    const filteredExpenses = expenses.filter((exp) => {
        const month = new Date(exp.date).getMonth() + 1;

        const monthMatch = monthFilter
            ? month === Number(monthFilter)
            : true;

        const categoryMatch = categoryFilter
            ? (exp.category || "").toLowerCase() === categoryFilter.toLowerCase()
            : true;

        return monthMatch && categoryMatch;
    });

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB").replace(/\//g, "-");

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
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
    return (
        <div className="expense-page">
            <h2 className="expense-title">Expense Management</h2>

            {/* FILTERS */}
            <div className="filters">
                <select onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <select onChange={(e) => setMonthFilter(e.target.value)}>
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
                    + Add Expense
                </button>
            </div>

            {/* TABLE */}
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
                        {paginatedExpenses.map((exp) => (
                            <tr key={exp._id}>
                                <td>{formatDate(exp.date)}</td>
                                <td>{exp.category}</td>
                                <td style={{ color: "red" }}>Rs.{exp.amount}</td>
                                <td>{exp.payment}</td>
                                <td>{exp.to}</td>

                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => {
                                            if (window.confirm("Delete this expense?")) {
                                                handleDelete(exp._id)
                                                //dispatch(deleteExpense(exp._id));
                                                setTimeout(() => {
                                                    alert("Expense deleted successfully ✅");
                                                }, 300);

                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
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


                            />

                            <select
                                name="payment"
                                value={form.payment}
                                onChange={handleChange}
                            >
                                <option value="">Payment Method</option>
                                {payments.map((pay, index) => (
                                    <option key={index} value={pay}>
                                        {pay}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="to"
                                placeholder="To Whom"
                                value={form.to}
                                onChange={handleChange}
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

export default Expense;