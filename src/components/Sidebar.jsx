import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import logo from "../assets/images/logo.png";
import {
  LayoutDashboard,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ArrowRightLeft,
  Wallet,
  ReceiptText,
  LogOut,
} from "lucide-react";
import Avatar from "../components/Avatar";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);

 const handleLogout = () => {
  localStorage.removeItem("sessionId");
  dispatch(logout());
  navigate("/Login");
  setSidebarOpen(false);
};

  const formatName = (name) => {
    if (!name) return "User";
    const firstWord = name.split(" ")[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar">

          <div className="logo">
            <img src={logo} alt="logo" />
          </div>

          <ul className="menu">
            <li>
              <Link
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""
                  }`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/expense"
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === "/expense" ? "active" : ""
                  }`}
              >
                <BanknoteArrowDown size={20} />
                Expense
              </Link>
            </li>

            <li>
              <Link
                to="/income"
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === "/income" ? "active" : ""
                  }`}
              >
                <BanknoteArrowUp size={20} />
                Income
              </Link>
            </li>

            <li>
              <Link
                to="/transaction"
               onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === "/transaction" ? "active" : ""
                  }`}
              >
                <ArrowRightLeft size={20} />
                Transactions
              </Link>
            </li>

            <li>
              <Link
                to="/budget"
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === "/budget" ? "active" : ""
                  }`}
              >
                <Wallet size={20} />
                Budget
              </Link>
            </li>

            <li>
              <Link
                to="/bill"
                onClick={() => setSidebarOpen(false)}
                className={`nav-item ${location.pathname === "/bill" ? "active" : ""
                  }`}
              >
                <ReceiptText size={20} />
                Bills
              </Link>
            </li>
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            <Avatar
              style={{ width: "32px", height: "32px" }}
              name={formatName(currentUser?.name)}
            />
            {formatName(currentUser?.name)}
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;