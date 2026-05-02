import { useState, useEffect } from "react";
import axios from "axios";
import "../Expense/expense.css";
import Pagination from "../../components/Pagination";

function Bills() {

    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://expense-backend-porh.onrender.com";

    const [bills, setBills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(7);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [form, setForm] = useState({
        name: "",
        category: "Bills",
        paymentMethod: "UPI",
        frequency: "Monthly",
        amount: "",
        dueDate: ""
    });

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-");
    };

    useEffect(() => {
        fetchBills();
    }, [page, limit]);

    // ✅ FETCH BILLS
    const fetchBills = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/bills`, {
                withCredentials: true
            });

            // ❌ REMOVE CLOSED BILLS FROM UI (important)
            const filtered = res.data.filter(b => b.status !== "closed");

            setBills(filtered);
            setTotal(filtered.length);
            setTotalPages(Math.ceil(filtered.length / limit));

        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ CREATE BILL (WITH ERROR HANDLING)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${API_URL}/api/bills`, {
                ...form,
                name: form.name.trim().toLowerCase() // ✅ normalize
            }, {
                withCredentials: true
            });

            alert("Bill created successfully ✅");

            setForm({
                name: "",
                category: "Bills",
                paymentMethod: "UPI",
                frequency: "Monthly",
                amount: "",
                dueDate: ""
            });

            setShowForm(false);
            fetchBills();

        } catch (err) {
            alert(err.response?.data?.message || "Failed to create bill");
        }
    };

    // ✅ MARK PAID
    const markPaid = async (bill) => {
        try {
            if (bill.status === "paid") {
                alert("Already paid");
                return;
            }

            await axios.post(
                `${API_URL}/api/bills/pay/${bill._id}`,
                {},
                { withCredentials: true }
            );

            alert("Bill paid successfully ✅");
            fetchBills();

        } catch (err) {
            alert(err.response?.data?.message || "Payment failed");
        }
    };

    // ✅ CLOSE BILL
    const handleCloseBill = async (id) => {
        try {
            await axios.put(`${API_URL}/api/bills/close/${id}`, {}, {
                withCredentials: true
            });

            alert("Bill closed ✅");
            fetchBills();

        } catch (err) {
            alert("Failed to close bill");
        }
    };

    // ✅ SUMMARY
    const summary = {
        paid: bills.filter(b => b.status === "paid").length,

        overdue: bills.filter(b => {
            const today = new Date();
            return b.status === "unpaid" && new Date(b.dueDate) < today;
        }).length,

        pending: bills.filter(b => {
            const today = new Date();
            return b.status === "unpaid" && new Date(b.dueDate) >= today;
        }).length,

        upcoming: bills
            .filter(b => b.status === "unpaid")
            .reduce((sum, b) => sum + Number(b.amount), 0)
    };

    const startIndex = (page - 1) * limit;
    const paginatedBills = bills.slice(startIndex, startIndex + limit);

    return (
        <>
            <div className="expense-page">
                <div className="def">
                    <h2 className="expense-title">Bill Management</h2>

                    <button
                        className="add-btn"
                        style={{ marginBottom: "7px" }}
                        onClick={() => setShowForm(true)}
                    >
                        + Add Bill
                    </button>
                </div>

                {/* SUMMARY */}
                <div className="cards" style={{ marginBottom: "15px" }}>
                    <div className="card">
                        <h3>Paid Bills</h3>
                        <h2>{summary.paid}</h2>
                    </div>

                    <div className="card">
                        <h3>Pending Bills</h3>
                        <h2>{summary.pending}</h2>
                    </div>

                    <div className="card">
                        <h3>Overdue Bills</h3>
                        <h2>{summary.overdue}</h2>
                    </div>

                    <div className="card">
                        <h3>Upcoming Payments</h3>
                        <h2>₹{summary.upcoming}</h2>
                    </div>
                </div>

                {/* TABLE */}
                <div className="expense-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Payment</th>
                                <th>Frequency</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Paid Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedBills.length > 0 ? (
                                paginatedBills.map((bill) => {

                                    const today = new Date();
                                    const due = new Date(bill.dueDate);

                                    let statusUI;

                                    if (bill.status === "paid") {
                                        statusUI = <span className="badge-income">Paid</span>;
                                    } else if (today > due) {
                                        statusUI = <span className="badge-expense">Overdue</span>;
                                    } else {
                                        statusUI = <span className="badge-pending">Pending</span>;
                                    }

                                    return (
                                        <tr key={bill._id}>
                                            <td>{bill.name}</td>
                                            <td>{bill.category}</td>
                                            <td>{bill.paymentMethod}</td>
                                            <td>{bill.frequency}</td>
                                            <td>₹{bill.amount}</td>
                                            <td>{formatDate(bill.dueDate)}</td>
                                            <td>{formatDate(bill.lastPaidDate)}</td>
                                            <td>{statusUI}</td>

                                            <td>
                                                {bill.status === "unpaid" && (
                                                    <button
                                                        className="add-btn"
                                                        onClick={() => markPaid(bill)}
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}

                                                <button
                                                    className="del-btn"
                                                    onClick={() => handleCloseBill(bill._id)}
                                                >
                                                    Close
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: "center" }}>
                                        No bill records found
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
                            <h3>Add Bill</h3>

                            <form onSubmit={handleSubmit} className="expense-form">

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Bill Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />

                                <input type="hidden" name="category" value="Bills" />

                                <select
                                    name="paymentMethod"
                                    value={form.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Card</option>
                                    <option value="NetBanking">NetBanking</option>
                                </select>

                                <select
                                    name="frequency"
                                    value={form.frequency}
                                    onChange={handleChange}
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>

                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={form.dueDate}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="modal-buttons">
                                    <button type="submit">Save</button>
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

export default Bills;