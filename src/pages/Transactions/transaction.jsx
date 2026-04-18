import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { useState, useMemo } from "react";
import { setTransactions } from "../../features/transaction/transactionSlice"
import FilterDrawer from "../../components/Drawer";
import UploadFeature from "../../components/UploadFeature";

function TransactionPage() {
    const API_URL = "https://expense-backend-porh.onrender.com"
    //const sessionId = localStorage.getItem("sessionId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemPerPage] = useState(8);
    //FILTERS
    const [categoryFilter, setCategoryFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [search, setSearch] = useState("");
    //DRAWER
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [tempCategory, setTempCategory] = useState("");
    const [tempMonth, setTempMonth] = useState("");
    const [tempType, setTempType] = useState("");
    const [tempSearch, setTempSearch] = useState("");
    //USER DATA OF INCOME ND EXPENSE
    const currentUser = useSelector((state) => state.user.currentUser);
    //const incomesData = useSelector((state) => state.income || []);
    //const expensesData = useSelector((state) => state.expense || []);
    const transactions = useSelector((state) => state.transaction);
    const categories = [...new Set(transactions.map(t => t.category))];

    //const incomes = useMemo(() =>
    //  incomesData.filter(e => e.user === currentUser?.email),
    // [incomesData, currentUser]
    //);

    //const expenses = useMemo(() =>
    // expensesData.filter(e => e.user === currentUser?.email),
    //[expensesData, currentUser]
    //);

    //const allTransactions = [
    // ...incomes.map((inc) => ({ ...inc, type: "income" })),
    // ...expenses.map((exp) => ({ ...exp, type: "expense" }))
    //];

    const filteredTransactions = transactions.filter((t) => {

        const month = new Date(t.date).getMonth() + 1;
        const category = t.category;
        const details = t.type === "income" ? t.source : t.to;

        const categoryMatch = categoryFilter ? (category || "").toLowerCase() === categoryFilter.toLowerCase() : true;
        const monthMatch = monthFilter ? month === Number(monthFilter) : true;
        const typeMatch = typeFilter ? t.type === typeFilter : true;
        const searchMatch = search
            ? details.toLowerCase().includes(search.toLowerCase())
            : true;

        return categoryMatch && monthMatch && typeMatch && searchMatch;
    });

    const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

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
        )
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    useEffect(() => {
        if (!currentUser?.email) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(
                   `${API_URL}/transaction`
                    , {
                        withCredentials: true

                    });
                //console.log("CURRENT USER EMAIL:", currentUser.email);
                //console.log("FETCHED TRANSACTIONS:", res.data);

                dispatch(setTransactions(res.data));
                //dispatch(setExpense(expenseRes.data));

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [currentUser, dispatch]);


    return (
        <>
            <div className="expense-page">

                <h2 className="expense-title">Transactions</h2>
                <div className="filters">
                <button className="filter-toggle" onClick={() => setDrawerOpen(true)}>
                    ☰ Filters
                </button>
                <UploadFeature />
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
                        setTypeFilter(tempType);
                        setSearch(tempSearch);
                        setDrawerOpen(false);
                        setCurrentPage(1); // reset page
                    }}

                    onReset={() => {
                        setTempCategory("");
                        setTempMonth("");
                        setTempType("");
                        setTempSearch("");

                        setCategoryFilter("");
                        setMonthFilter("");
                        setTypeFilter("");
                        setSearch("");
                    }}
                />

                <div className="expense-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Details</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedTransactions.length > 0 ? (
                                paginatedTransactions.map((t) => {

                                    const category = t.type === "income" ? t.category : t.category;
                                    const details = t.type === "income" ? t.source : t.to;

                                    return (
                                        <tr key={t._id}>
                                            <td>
                                                {new Date(t.date)
                                                    .toLocaleDateString("en-GB")
                                                    .replace(/\//g, "-")}
                                            </td>

                                            <td>
                                                <span className={t.type === "income" ? "badge-income" : "badge-expense"}>
                                                    {t.type}
                                                </span>
                                            </td>

                                            <td>{category}</td>
                                            <td>{details}</td>

                                            <td style={{
                                                color: t.type === "income" ? "green" : "red",
                                                fontWeight: "bold"
                                            }}>
                                                {t.type === "income" ? "+" : "-"}Rs.{Math.abs(t.amount)}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {renderPaginationControls()}
        </>
    );
}

export default TransactionPage;