import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux"


const COLORS = ["#7b3fe4", "#c084fc","#FF33A8", "#f59e0b", "#34d399", "#f4a6ff","#F3FF33", "#06b6d4",];



function Chart() {

  const transactions = useSelector((state) => state.transaction);

  const currentUser = useSelector((state) => state.user.currentUser)
  const expenses = transactions.filter(
    (t) => t.user === currentUser?.email && t.type === "expense")
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const userExpenses =expenses.filter((e) => {
    const expenseDate = new Date(e.date);

    return (
      e.user === currentUser?.email &&
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
  
  const categoryData = {}

  userExpenses.forEach((exp) => {

    if (categoryData[exp.category]) {
      categoryData[exp.category] += Number(exp.amount)
    } else {
      categoryData[exp.category] = Number(exp.amount)
    }

  })

  // convert object → array for chart
  const data = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key]
  }))



  return (
    <div className="chart-box">
      <h3>Spending Breakdown</h3>

      <div className="pie-container">
        <ResponsiveContainer width="60%" height={250}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"

            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
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
                style={{ background: COLORS[index] }}
              ></span>
              {item.name} <b>{item.value}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chart;