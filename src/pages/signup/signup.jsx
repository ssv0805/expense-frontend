import { useState } from 'react'
import axios from "axios"
import { FiEye, FiEyeOff } from "react-icons/fi";
import './signup.css'
import { useDispatch } from "react-redux";
//import { signup } from "../../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom"
import myImage from '../../assets/images/login3.png';

const Signup = () => {
    const API_URL = "https://expense-backend-porh.onrender.com"
    let regex = /^[a-zA-Z0-9]+@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/;
    let pattern = /^[a-zA-Z ]+$/;
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        {/*if(e.target.value!==password){
            setErrors(prev=>({...prev,confirmPassword:"Passwords do not match"}));
        }
        else{
            setErrors(prev=>({...prev,confirmPassword:""}));
        }*/}
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        //Name validation
        if (!name.trim()) {
            isValid = false;
            formErrors.name = "Name is required";
        }
        else if (!pattern.test(name)) {
            isValid = false;
            formErrors.name = "Please type a valid name"
        }


        //Email Validation
        if (!email.trim()) {
            isValid = false;
            formErrors.email = "Email address is required";
        }
        else if (!regex.test(email)) {
            isValid = false;
            formErrors.email = "Email address is not correct"
        }

        //Password Validation
        if (!password.trim()) {
            isValid = false;
            formErrors.password = "password is required";
        }
        else if (password.length < 8) {
            isValid = false;
            formErrors.password = "Password must contain atleast 8 characters";
        }

        //Confirm Password Validation
        if (!confirmPassword) {
            isValid = false;
            formErrors.confirmPassword = "Confirm Password is required";
        }
        else if (confirmPassword !== password) {
            isValid = false;
            formErrors.confirmPassword = "Passwords do not match";
        }


        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form has errors. Please correct them.");
            return;
        }

        const user = {
            name,
            email,
            password
        };

        try {
            const res = await axios.post(`${API_URL}/signup`, {
                name,
                email,
                password
            });

            if (res.data.success) {
                //dispatch(signup(user)); 
                alert("Signup successful");
                console.log("Form submitted successfully");
                navigate("/Login");
            }
        } catch (e) {
            console.log(e);

            if (e.response?.status === 409) {
                alert("User already exists");
            } else {
                alert("Signup failed");
            }
        }
    };


    return (
        <div className="login-page">
            <div className="left-section">
                <h1 className="title">Expense Tracker</h1>
                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className="header">
                            <div className="text">Sign Up</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <label>Name<span className='asterisk'>*</span></label>
                            <div className="input">
                                <input type="text" value={name} placeholder='Enter Name' onChange={(e) => setName(e.target.value)} />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            <label>Email<span className='asterisk'>*</span></label>
                            <div className="input">
                                <input type="email" value={email} placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>
                            <label>Password<span className='asterisk'>*</span></label>
                            <div className="input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span
                                    className="toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                                {errors.password && <span className="error">{errors.password}</span>}
                            </div>
                            <label>Confirm Password<span className='asterisk'>*</span></label>
                            <div className="input">
                                <input type={showCPassword ? "text" : "password"} value={confirmPassword} placeholder='Enter Password' onChange={handleConfirmPasswordChange} />
                                <span
                                    className="toggle-btn"
                                    onClick={() => setShowCPassword(!showCPassword)}
                                >
                                    {showCPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                            </div>
                        </div>
                        <div>
                            <div className="submit-container">
                                <button className="submit" type="submit" >Sign Up</button>
                            </div>
                            <p >Already have an account?<Link to="/Login">Log in</Link></p>
                        </div>

                    </div>
                </form>

            </div>
            <div className="right-section">
                <img src={myImage} alt="login illustration" />
            </div>

        </div>
    )
}

export default Signup