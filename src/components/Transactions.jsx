import { useSelector } from "react-redux";

function Transactions() {

  // ✅ get all transactions
  const transactions = useSelector((state) => state.transaction || []);
  const currentUser = useSelector((state) => state.user.currentUser);

  // ✅ filter by user
  const userTransactions = transactions.filter(
    (t) => t.user === currentUser?.email
  );

  // ✅ sort latest first
  const sortedTransactions = [...userTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // ✅ take recent 6
  const recentTransactions = sortedTransactions.slice(0, 6);

  return (
    <div className="transactions">

      <h3>Recent Transactions</h3>

      {recentTransactions.map((t) => (
        <div key={t._id} className="transaction-item">

          <div className="transaction-left">
            <div className="transaction-icon">💳</div>

            <div>
              {/* ✅ category */}
              <h4>{t.category}</h4>

              {/* ✅ details */}
              <p>{t.type === "income" ? t.source : t.to}</p>
            </div>
          </div>

          <div className="transaction-right">
            <span className="date">{t.date}</span>

            <span className={t.type === "income" ? "income" : "expense"}>
              {t.type === "income" ? "+" : "-"}Rs.{Math.abs(t.amount)}
            </span>
          </div>

        </div>
      ))}

    </div>
  );
}

export default Transactions;