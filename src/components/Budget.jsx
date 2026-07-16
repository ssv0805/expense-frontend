import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../assets/images/Budget.png";

function Budget() {
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://expense-backend-porh.onrender.com";

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetRes, transactionRes] = await Promise.all([
        axios.get(`${API_URL}/api/budget`, {
          withCredentials: true,
        }),

        // ✅ FULL DATA API (IMPORTANT FIX)
        axios.get(`${API_URL}/transaction/all`, {
          withCredentials: true,
        }),
      ]);

      setBudgets(budgetRes.data);
      setTransactions(transactionRes.data);
    } catch (err) {
      console.log("Budget Dashboard Error:", err);
    }
  };

  const getSpent = (category) => {
    const now = new Date();

    return transactions
      .filter((t) => {
        const date = new Date(t.date);

        return (
          t.type === "expense" &&
          t.category === category &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return (
    <div className="budget">
      <h3>Budget Overview</h3>

      {budgets.length === 0 ? (
        <div className="empty-state">
          <img src={Image} alt="No Budget" />
        </div>
      ) : (
        budgets.slice(0, 6).map((item) => {
          const spent = getSpent(item.category);

          const percent = item.amount
            ? Math.min((spent / item.amount) * 100, 100)
            : 0;

          return (
            <div key={item._id} className="budget-item">
              <div className="budget-header">
                <span>{item.category}</span>
                <span>
                  ₹{spent} / ₹{item.amount}
                </span>
              </div>

              <div className="budget-bar">
                <div
                  className="budget-fill"
                  style={{
                    width: `${percent}%`,
                    background:
                      percent > 100
                        ? "red"
                        : percent > 80
                          ? "#e846a4"
                          : "#6a2c91",
                  }}
                ></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Budget;