import Sidebar from "./Sidebar";
import Avatar from "./Avatar";
import "../pages/Dashboard/dashboard.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout() {
  const currentUser = useSelector((state) => state.user.currentUser);

  
  const formatName = (name) => {
    if (!name) return "User";

    const firstWord = name.split(" ")[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  };

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          {/*<h1>Trackify</h1>*/}

          <div className="user-section">
            <div className="user">

              <Avatar name={formatName(currentUser?.name)} />

              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {formatName(currentUser?.name)}
              </span>

            </div>
          </div>

        </div>

        {/* Page Content */}
        <div className="content">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default Layout;