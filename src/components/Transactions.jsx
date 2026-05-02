import { useSelector } from "react-redux";
import myImage from "../assets/images/No_Transaction.png";

function Transactions() {
  const currentUser = useSelector((state) => state.user.currentUser);

  // ✅ ALWAYS use full dataset
  const transactions = useSelector(
    (state) => state.transaction.all || []
  );

  const userTransactions = transactions.filter(
    (t) => t.user === currentUser?.email
  );

  const sortedTransactions = [...userTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const recentTransactions = sortedTransactions.slice(0, 6);

  return (
    <div className="transactions">
      <h3>Recent Transactions</h3>

      {recentTransactions.length === 0 ? (
        <div className="empty-state">
          <img src={myImage} alt="No transactions" />
        </div>
      ) : (
        recentTransactions.map((t) => (
          <div key={t._id} className="transaction-item">
            <div className="transaction-left">
              <div className="transaction-icon">💳</div>

              <div>
                <h4>{t.category}</h4>
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
        ))
      )}
    </div>
  );
}

export default Transactions;