import Card from "../../components/Cards";
import Graph from "../../components/graph";
import Chart from "../../components/chart";
import Transactions from "../../components/Transactions";
import Budget from "../../components/Budget";
import Bills from "../../components/Bills";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setTransactions } from "../../features/transaction/transactionSlice";
import "./dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const transactions = useSelector((state) => state.transaction.all || []);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://expense-backend-porh.onrender.com";

  // ✅ FETCH ALL TRANSACTIONS FOR DASHBOARD
  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchAll = async () => {
      try {
        const res = await axios.get(`${API_URL}/transaction/all`, {
          withCredentials: true,
        });

        dispatch(setTransactions({ all: res.data }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, [currentUser, dispatch]);

  const expenses = transactions.filter(
    (t) => t.user === currentUser?.email && t.type === "expense"
  );

  const incomes = transactions.filter(
    (t) => t.user === currentUser?.email && t.type === "income"
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthIncome = incomes.filter((inc) => {
    const date = new Date(inc.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const currentMonthExpense = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const previousMonthIncome = incomes.filter((inc) => {
    const date = new Date(inc.date);
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
  });

  const previousMonthExpense = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
  });

  const totalIncome = currentMonthIncome.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = currentMonthExpense.reduce((s, e) => s + Number(e.amount), 0);

  const prevIncome = previousMonthIncome.reduce((s, i) => s + Number(i.amount), 0);
  const prevExpense = previousMonthExpense.reduce((s, e) => s + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;
  const prevBalance = prevIncome - prevExpense;
  const savings = balance;

  const calculateChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const incomeChange = calculateChange(totalIncome, prevIncome);
  const expenseChange = calculateChange(totalExpense, prevExpense);
  const balanceChange = calculateChange(balance, prevBalance);

  const savingsPercent =
    totalIncome === 0 ? 0 : ((savings / totalIncome) * 100).toFixed(1);

  const formatFullName = (name) => {
    if (!name) return "User";
    return name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      <div className="dashboard-header">
        <h2>Welcome, {formatFullName(currentUser?.name)}</h2>
      </div>

      <Card
        balance={balance}
        income={totalIncome}
        expense={totalExpense}
        savings={savings}
        balanceChange={balanceChange}
        incomeChange={incomeChange}
        expenseChange={expenseChange}
        savingsPercent={savingsPercent}
      />

      <div className="charts">
        <Graph />
        <Chart />
      </div>

      <div className="bottom">
        <Transactions />
        <Budget />
        <Bills />
      </div>
    </>
  );
}

export default Dashboard;