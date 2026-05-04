import Sidebar from "./Sidebar";
import Avatar from "./Avatar";
import "../pages/Dashboard/dashboard.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import axios from "axios";

function Layout() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://trackify-backend-3kys.onrender.com";

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const dropdownRef = useRef(null);

  const formatName = (name) => {
    if (!name) return "User";
    const firstWord = name.split(" ")[0];
    return (
      firstWord.charAt(0).toUpperCase() +
      firstWord.slice(1).toLowerCase()
    );
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setShowDropdown(false);
  };

  // ✅ Update Name
const handleNameUpdate = async () => {
  try {
    await axios.put(
      `${API_URL}/update-name`,
      { name: newName },
      { withCredentials: true }
    );

    alert("Name updated");
    setShowModal(false);
    window.location.reload();
  } catch (err) {
    alert(err.response?.data?.message || "Error updating name");
  }
};

  // ✅ Change Password
const handlePasswordUpdate = async () => {
  try {
    await axios.put(
      `${API_URL}/change-password`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );

    alert("Password updated");
    setShowModal(false);

    setCurrentPassword("");
    setNewPassword("");
  } catch (err) {
    alert(err.response?.data?.message || "Error updating password");
  }
};

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="user-section">
            <div className="user" ref={dropdownRef}>
              <Avatar name={formatName(currentUser?.name)} />

              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {formatName(currentUser?.name)}
              </span>

              <button
                className="dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <ChevronDown size={18} />
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={() => openModal("name")}>
                    Edit Name
                  </button>
                  <button onClick={() => openModal("password")}>
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>

      
      {showModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="def">
               <h2>
              {modalType === "name"
                ? "Edit Name"
                : "Change Password"}
            </h2>

            <button
              className="close-btn" style={{background :"#3b1347"}}
              onClick={() => setShowModal(false)}
            >
              X
            </button>

           
            </div>

            {modalType === "name" ? (
              <>
                <input
                  type="text"
                  placeholder="Enter new name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button className="save-btn" onClick={handleNameUpdate}>
                  Save Name
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />
                <button
                  className="save-btn"
                  onClick={handlePasswordUpdate}
                >
                  Update Password
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;