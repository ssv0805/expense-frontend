function Budget() {

  const budgets = [
    { category: "Food", spent: 450, total: 800 },
    { category: "Shopping", spent: 300, total: 600 },
    { category: "Transport", spent: 120, total: 300 },
    { category: "Entertainment", spent: 200, total: 400 },
    { category: "Travel", spent: 1000, total: 3000 },
    { category: "Other", spent: 100, total: 700 },
  ];

  return (
    <div className="budget">

      <h3>Budget Overview</h3>

      {budgets.map((item, index) => {

        const percent = (item.spent / item.total) * 100;

        return (
          <div key={index} className="budget-item">

            <div className="budget-header">
              <span>{item.category}</span>
              <span>{item.spent} / {item.total}</span>
            </div>

            <div className="budget-bar">
              <div
                className="budget-fill"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

          </div>
        );
      })}

    </div>
  );
}

export default Budget;