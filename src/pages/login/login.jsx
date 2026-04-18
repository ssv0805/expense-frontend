import { useState } from "react";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginSuccess } from "../../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import myImage from '../../assets/images/login3.png';

const Login = () => {
  const API_URL = "https://expense-backend-porh.onrender.com"
  
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

 // const registeredUsers = useSelector((state) => state.user.registeredUsers) || [];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    let formErrors = {};

    if (!email.trim()) {
      formErrors.email = "Email is required";
    }

    if (!password.trim()) {
      formErrors.password = "Password is required";
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password
      },
    {
      withCredentials:true
    });

      dispatch(loginSuccess(res.data.user))
      
      if (res.data.success) {
        console.log("Login Successful");
        navigate("/dashboard");
      }
    } catch (e) {
      console.log(e);

      if (e.response?.status === 404) {
        setGeneralError("User not found. Please signup first.");
      } else if (e.response?.status === 401) {
        setGeneralError("Invalid email or password");
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <h1>Expense Tracker</h1>

        <form onSubmit={handleSubmit}>
          <div className="container">
            <div className="header">
              <div className="text">Log In</div>
              <div className="underline"></div>
            </div>
            {generalError && <span className="error">{generalError}</span>}

            <div className="inputs">
              <label>
                Email<span className="asterisk">*</span>
              </label>
              <div className="input">
                <input
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                    setGeneralError("");
                  }}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <label>
                Password<span className="asterisk">*</span>
              </label>
              <div className="input">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                    setGeneralError("");
                  }}
                />
                <span
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                {errors.password && (
                  <span className="error">{errors.password}</span>
                )}
              </div>

            </div>

            <div className="forgot-password">
              Forgot Password?<span> Click Here!</span>
            </div>

            <div className="submit-container">
              <button className="submit" type="submit">
                Log In
              </button>
            </div>

            <div className="forgot-password" style={{ marginTop: "20px" }}>
              Create an account! <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </form>
      </div>

      <div className="right-section">
        <img src={myImage} alt="login illustration" />
      </div>
    </div>
  );
};

export default Login;