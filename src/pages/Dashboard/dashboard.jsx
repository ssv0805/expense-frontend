import Card from "../../components/Cards";
import Graph from "../../components/graph";
import Chart from "../../components/chart";
import Transactions from "../../components/Transactions";
import Budget from "../../components/Budget";
import Bills from "../../components/Bills";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "./dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser)||{};

  const transactions = useSelector((state) => state.transaction )|| [];

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

  // Current month income
  const currentMonthIncome = incomes.filter((inc) => {
    const date = new Date(inc.date);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });
  

  // Current month expense
  const currentMonthExpense = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  // Previous month income
  const previousMonthIncome = incomes.filter((inc) => {
    const date = new Date(inc.date);
    return (
      date.getMonth() === previousMonth &&
      date.getFullYear() === previousYear
    );
  });

  // Previous month expense
  const previousMonthExpense = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return (
      date.getMonth() === previousMonth &&
      date.getFullYear() === previousYear
    );
  });

  // Totals
  const totalIncome = currentMonthIncome.reduce(
    (sum, inc) => sum + Number(inc.amount),
    0
  );

  const totalExpense = currentMonthExpense.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const prevIncome = previousMonthIncome.reduce(
    (sum, inc) => sum + Number(inc.amount),
    0
  );

  const prevExpense = previousMonthExpense.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  const balance = totalIncome - totalExpense;
  const prevBalance = prevIncome - prevExpense;
  const savings = balance;

  // Percentage change helper
  const calculateChange = (current, previous) => {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const incomeChange = calculateChange(totalIncome, prevIncome);
  const expenseChange = calculateChange(totalExpense, prevExpense);
  const balanceChange = calculateChange(balance, prevBalance);

  const savingsPercent =
    totalIncome === 0 ? 0 : ((savings / totalIncome) * 100).toFixed(1);

  return (
    <div className="content">
      <div className="dashboard-header">
        <h2>Welcome, {currentUser?.name || "User"}</h2>
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
    </div>
  );
}

export default Dashboard;