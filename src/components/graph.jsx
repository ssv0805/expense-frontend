import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useSelector } from "react-redux"



function Graph() {
  const currentUser = useSelector((state) => state.user.currentUser)

  const transactions = useSelector((state) => state.transaction);

  const userExpenses =  transactions.filter(
    (t) => t.user === currentUser?.email && t.type === "expense")

  const userIncomes =  transactions.filter(
    (t) => t.user === currentUser?.email && t.type === "income")

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const monthlyData = months.map((month, index) => {

    const income = userIncomes
      .filter((inc) => new Date(inc.date).getMonth() === index)
      .reduce((sum, i) => sum + Number(i.amount), 0)

    const expense = userExpenses
      .filter((exp) => new Date(exp.date).getMonth() === index)
      .reduce((sum, e) => sum + Number(e.amount), 0)

    return {
      month,
      income,
      expense
    }

  })


  return (
    <div className="chart-box">
      <h3>Expense vs Income</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="income" fill="#7b3fe4" radius={[5, 5, 0, 0]} />

          <Bar dataKey="expense" fill="#f4a6ff" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;