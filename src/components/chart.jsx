import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import image from "../assets/images/chart.png";

const COLORS = [
  "#7b3fe4",
  "#c084fc",
  "#FF33A8",
  "#f59e0b",
  "#34d399",
  "#f4a6ff",
  "#F3FF33",
  "#06b6d4",
];

function Chart() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [transactions, setTransactions] = useState([]);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://trackify-backend-3kys.onrender.com";

  // ✅ FETCH ALL TRANSACTIONS
  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchAll = async () => {
      try {
        const res = await axios.get(`${API_URL}/transaction/all`, {
          withCredentials: true,
        });

        setTransactions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, [currentUser]);

  // ✅ FILTER USER EXPENSES
  const expenses = transactions.filter(
    (t) => t.user === currentUser?.email && t.type === "expense"
  );

  // current month filter
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const userExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  // ✅ GROUP BY CATEGORY
  const categoryData = {};

  userExpenses.forEach((exp) => {
    const amount = Number(exp.amount);

    if (categoryData[exp.category]) {
      categoryData[exp.category] += amount;
    } else {
      categoryData[exp.category] = amount;
    }
  });

  const data = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
  }));

  return (
    <div className="chart-box">
      <h3>Spending Breakdown</h3>

      {data.length === 0 ? (
        <div className="emptyy-state">
          <img src={image} alt="No data" />
        </div>
      ) : (
        <div className="pie-container">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="pie-labels">
            {data.map((item, index) => (
              <div key={index} className="pie-item">
                <span
                  className="color-box"
                  style={{ background: COLORS[index % COLORS.length] }}
                ></span>
                {item.name} <b>{item.value}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;