import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Signup() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        pass: "",
        cpass: "",
    });
    const [errorMsg, setErrorMsg] = useState([]);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = (event) => {
        const email = event.target.value;
        setValues(prev => ({ ...prev, email }));

        if (email.trim() === "") {
            setErrorMsg([]);
            setIsEmailValid(false);
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMsg(["Invalid Email Format"]);
            setIsEmailValid(false);
        } else {
            setErrorMsg([]);
            setIsEmailValid(true);
        }
    };

    const isValidPassword = (password) => {
        let errorList = [];

        if (password.length < 8) errorList.push("Minimum 8 characters");
        if (!/[A-Z]/.test(password)) errorList.push("At least one uppercase letter");
        if (!/[a-z]/.test(password)) errorList.push("At least one lowercase letter");
        if (!/\d/.test(password)) errorList.push("At least one number");
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errorList.push("At least one special character");

        return errorList;
    };

    const handlePasswordChange = (event) => {
        const pass = event.target.value;
        setValues(prev => ({ ...prev, pass }));

        const passwordErrors = isValidPassword(pass);

        if (passwordErrors.length > 0) {
            setErrorMsg(passwordErrors);
            setIsPasswordValid(false);
        } else {
            setErrorMsg([]);
            setIsPasswordValid(true);
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const cpass = event.target.value;
        setValues(prev => ({ ...prev, cpass }));

        if (cpass !== values.pass) {
            setErrorMsg(["Passwords don't match!"]);
        } else {
            setErrorMsg([]);
        }
    };

    const handleSubmission = () => {
        let errors = [];

        if (!values.email) errors.push("Email not filled.");
        if (!values.pass) errors.push("Password not filled.");
        if (values.pass !== values.cpass) errors.push("Password & Confirm Password do not match");

        setErrorMsg(errors);
        if (errors.length === 0) {
            setLoading(true);

            createUserWithEmailAndPassword(auth, values.email, values.pass)
                .then(async (res) => {
                    const user = res.user;
                    await updateProfile(user, {
                        displayName: values.email,
                    });
                    setLoading(false);
                    navigate("/login");
                })
                .catch((err) => {
                    setErrorMsg([err.message]);
                });
        }
    };

    return (
        <div className="wrapper">
            <div className="container main">
                <div className="row">
                    <div className="col-md-6 side-image">
                        <img className="img2" src="./images/b2.jpg" alt="" />
                    </div>
                    <div className="col-md-6 right">
                        <div className="input-box">
                            <header>Create an account</header>
                            <div className="input-field">
                                <input type="text" className="input" id="email" required autoComplete="on"
                                       onChange={handleEmailChange} />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input type="password" className="input" required id="pass"
                                       disabled={!isEmailValid}
                                       onChange={handlePasswordChange} />
                                <label htmlFor="pass">Password</label>
                            </div>
                            <div className="input-field">
                                <input type="password" className="input" required id="cpass"
                                       disabled={!isPasswordValid}
                                       onChange={handleConfirmPasswordChange} />
                                <label htmlFor="cpass">Confirm Password</label>
                            </div>
                            <div className="input-field">
                                {errorMsg.length > 0 &&
                                    <ul className="error-list">
                                        {errorMsg.map((error, index) => <li key={index}>{error}</li>)}
                                    </ul>
                                }
                                <input type="submit" className="submit" value="Sign Up" onClick={handleSubmission} />
                            </div>
                            <div className="signin">
                                <span>Already have an account? <Link to="/login">Login</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
