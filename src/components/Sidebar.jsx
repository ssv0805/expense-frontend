import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    dispatch(logout());
    navigate("/Login");
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Expense Tracker</h2>

      <ul className="menu">
        <li>
          <Link to="/dashboard" className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>Dashboard</Link>
        </li>

        <li>
          <Link to="/expense" className={`nav-item ${location.pathname === "/expense" ? "active" : ""}`}>Expense</Link>
        </li>

        <li>
          <Link to="/income" className={`nav-item ${location.pathname === "/income" ? "active" : ""}`}>Income</Link>
        </li>

        <li>
          <Link to="/transaction" className={`nav-item ${location.pathname === "/transaction" ? "active" :location.pathname==="/file"?"active": ""}`}>Transactions</Link>
        </li>
        
        <li className="Wlink">Budget</li>
        <li className="Wlink">Bills</li>


        <li className="Wlink" onClick={handleLogout} style={{ cursor: "pointer" }}>
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;