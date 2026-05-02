import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import logo from "../assets/images/logo.png"
import { LayoutDashboard } from 'lucide-react';
import { BanknoteArrowDown } from 'lucide-react';
import { BanknoteArrowUp } from 'lucide-react';
import { ArrowRightLeft } from 'lucide-react';
import { Wallet } from 'lucide-react';
import { ReceiptText } from 'lucide-react';
import { LogOut } from "lucide-react";
import Avatar from "../components/Avatar"

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("sessionId");
    dispatch(logout());
    navigate("/Login");
  };
  const currentUser = useSelector((state) => state.user.currentUser);


  const formatName = (name) => {
    if (!name) return "User";

    const firstWord = name.split(" ")[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <ul className="menu">
        <li>

          <Link to="/dashboard" className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </li>

        <li>

          <Link to="/expense" className={`nav-item ${location.pathname === "/expense" ? "active" : ""}`}>
            <BanknoteArrowDown size={20} />
            Expense</Link>

        </li>

        <li>

          <Link to="/income" className={`nav-item ${location.pathname === "/income" ? "active" : ""}`}>
            <BanknoteArrowUp size={20} />
            Income
          </Link>

        </li>

        <li>

          <Link to="/transaction" className={`nav-item ${location.pathname === "/transaction" ? "active" : ""}`}>
            <ArrowRightLeft size={20} />
            Transactions
          </Link>
        </li>

        <li>

          <Link to="/budget" className={`nav-item ${location.pathname === "/budget" ? "active" : ""}`}>
            <Wallet size={20} />
            Budget
          </Link>
        </li>
        <li >

          <Link to="/bill" className={`nav-item ${location.pathname === "/bill" ? "active" : ""}`}>
            <ReceiptText size={20}/>
            Bills
            
          </Link>
        </li>



      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        <Avatar style={{ width: "32px", height: "32px" }} name={formatName(currentUser?.name)} />
        {formatName(currentUser?.name)}
        <LogOut size={20} />
      </button>
    </div>
  );
}

export default Sidebar;