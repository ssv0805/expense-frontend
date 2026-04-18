import Sidebar from "./Sidebar"
import Avatar from "./Avatar";
import "../pages/Dashboard/dashboard.css"
import { Outlet } from "react-router-dom"
import { useSelector } from "react-redux";

function Layout() {
  const currentUser = useSelector((state) => state.user.currentUser);
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">

        {/* Topbar */}

        <div className="topbar">
          {/*<div className="search">
            <input type="text" placeholder="Search" />
          </div>*/}

          <div className="user-section">
            <div className="user">
              <Avatar name={currentUser?.name || "User"} />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>{currentUser?.name || "User"}</span>
              
            </div>
          </div>
        </div>

        {/* Page Content */}

        <div className="content">
          <Outlet />
        </div>

      </div>

    </div>
  )
}

export default Layout