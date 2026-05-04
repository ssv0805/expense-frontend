import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { useState, useMemo } from "react";
import { setTransactions } from "../../features/transaction/transactionSlice"
import FilterDrawer from "../../components/Drawer";
import UploadFeature from "../../components/UploadFeature";
import Pagination from "../../components/Pagination";

function TransactionPage() {
    const API_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:5000"
            : "https://trackify-backend-3kys.onrender.com";
    //const sessionId = localStorage.getItem("sessionId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //PAGINATION
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(7);
    const [allCategories, setAllCategories] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
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
    const transactions = useSelector(
        (state) => state.transaction
    ) || [];
    const categories = allCategories;

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


    useEffect(() => {
    const fetchAllCategories = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/transaction/all`,
                {
                    withCredentials: true
                }
            );

            const uniqueCategories = [
                ...new Set(
                    res.data
                        .map((item) => item.category?.trim())
                        .filter(Boolean)
                )
            ];

            setAllCategories(uniqueCategories);

        } catch (err) {
            console.log(err);
        }
    };

    fetchAllCategories();
}, []);


    useEffect(() => {
        if (!currentUser?.email) return;

        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/transaction`
                    , {
                        withCredentials: true,
                        params: {
                            page,
                            limit,
                            category: categoryFilter,
                            type: typeFilter,
                            month: monthFilter
                        },

                    });
                //console.log("CURRENT USER EMAIL:", currentUser.email);
                //console.log("FETCHED TRANSACTIONS:", res.data);

                dispatch(setTransactions(res.data.data));
                setTotalPages(res.data.totalPages);
                setTotal(res.data.total);
                //dispatch(setExpense(expenseRes.data));

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [currentUser,
        page,
        limit,
        categoryFilter,
        monthFilter,
        typeFilter, dispatch]);

    const downloadExcel = async () => {
        const res = await fetch(`${API_URL}/transaction/export`, {
            credentials: "include"
        });


        if (res.status === 401) {
            alert("Session expired. Please login again.");

            return;
        }


        if (!res.ok) {
            const err = await res.json();
            alert(err.message || "Download failed");
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.xlsx";
        a.click();

        window.URL.revokeObjectURL(url);
    };




    return (
        <>
            <div className="expense-page">
                <div className="def">
                    <h2 className="expense-title">Transactions</h2>
                    <div className="filters">
                        <button className="filter-toggle" onClick={() => setDrawerOpen(true)}>
                            ☰ Filters
                        </button>
                        <UploadFeature />
                        <button className="add-btn" onClick={downloadExcel}>
                            Export File
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
                        setTypeFilter(tempType);
                        setSearch(tempSearch);
                        setDrawerOpen(false);
                        setPage(1); // reset page
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
                    showType={true}

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
                            {Array.isArray(transactions) && transactions.length > 0 ? (
                                transactions.map((t) => {

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
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        No transaction records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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

export default TransactionPage;