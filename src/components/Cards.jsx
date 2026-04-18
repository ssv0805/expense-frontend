function Card({
  balance,
  income,
  expense,
  savings,
  balanceChange,
  incomeChange,
  expenseChange,
  savingsPercent,
}) {
  const balancePositive = Number(balanceChange) >= 0;
  const incomePositive = Number(incomeChange) >= 0;
  const expensePositive = Number(expenseChange) <= 0; // lower expense is good

  return (
    <div className="cards">
      <div className="card balance">
        <h3>Total Balance</h3>
        <h2>Rs.{balance}</h2>
        <p className={balancePositive ? "positive" : "negative"} style={{fontWeight:"bold"}}>
          {balancePositive ? "+" : ""}
          {balanceChange}% vs last month
        </p>
      </div>

      <div className="card income">
        <h3>Monthly Income</h3>
        <h2>Rs.{income}</h2>
        <p className={incomePositive ? "positive" : "negative"}>
          {incomePositive ? "+" : ""}
          {incomeChange}% vs last month
        </p>
      </div>

      <div className="card expense">
        <h3>Monthly Expenses</h3>
        <h2>Rs.{expense}</h2>
        <p className={expensePositive ? "positive" : "negative"}>
          {Number(expenseChange) > 0 ? "+" : ""}
          {expenseChange}% vs last month
        </p>
      </div>

      <div className="card savings">
        <h3>Savings</h3>
        <h2>Rs.{savings}</h2>
        <p style={{fontSize:"14px", fontWeight:"bold"}}>{savingsPercent}% of income saved</p>
        <div className="progress">
          <div
            className="progress-bar"
            style={{ width: `${Math.min(Math.max(Number(savingsPercent), 0), 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Card;