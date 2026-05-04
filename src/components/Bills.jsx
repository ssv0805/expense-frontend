import { useEffect, useState } from "react";
import axios from "axios";
import image from "../assets/images/Bills.png";

function Bills() {
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://trackify-backend-3kys.onrender.com";

  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bills`, {
        withCredentials: true
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // show only upcoming unpaid bills
      const filtered = res.data
        .filter((bill) => {
          const dueDate = new Date(bill.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          return bill.status === "unpaid" && (dueDate <= today  || dueDate>=today);
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 6);

      setBills(filtered);

    } catch (err) {
      console.log("Dashboard Bills Error:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="bills">
      <h3>Upcoming Bills</h3>

      {bills.length === 0 ? (
        <div className="empty-state">
          <img src={image} alt="No Bills" />
        </div>
      ) : (
        bills.map((bill) => (
          <div key={bill._id} className="bill-item">
            <div className="bill-left">
              <div className="bill-icon">📄</div>

              <div>
                <h4>{bill.name}</h4>
                <p>Due {formatDate(bill.dueDate)}</p>

                <small style={{ color: "#888" }}>
                  upcoming
                </small>
              </div>
            </div>

            <div className="bill-right">
              ₹{bill.amount}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Bills;