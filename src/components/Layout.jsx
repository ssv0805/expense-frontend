import Sidebar from "./Sidebar";
import Avatar from "./Avatar";
import "../pages/Dashboard/dashboard.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/user/userSlice";

function Layout() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://expense-backend-porh.onrender.com";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [showNPassword, setShowNPassword] = useState(false);

  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // Update Name
  const handleNameUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/update-name`,
        { name: newName },
        { withCredentials: true }
      );

      dispatch(
        loginSuccess({
          ...currentUser,
          name: newName,
        })
      );

      setShowModal(false);
      setNewName("");

      alert("Name updated");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating name");
    }
  };

  // Change Password
  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      alert("Password updated");
      setShowModal(false);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">

          <div className="user-section">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="user" ref={dropdownRef}>
              <Avatar name={formatName(currentUser?.name)} />

              <span style={{ fontSize: "16px", fontWeight: "bold" }} onClick={() => setShowDropdown(!showDropdown)}>
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

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="ef def">
              <h2>
                {modalType === "name"
                  ? "Edit Name"
                  : "Change Password"}
              </h2>

              <button
                className="close-btn"
                style={{ background: "white", border: "0" }}
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
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
                <div className="input password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  <span
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>

                <div className="input password-input">
                  <input
                    type={showNPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <span
                    className="toggle-btn"
                    onClick={() => setShowNPassword(!showNPassword)}
                  >
                    {showNPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>

                <div className="input password-input">
                  <input
                    type={showCPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <span
                    className="toggle-btn"
                    onClick={() => setShowCPassword(!showCPassword)}
                  >
                    {showCPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>

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