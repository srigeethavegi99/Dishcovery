import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import './login.css';
import { auth } from "./firebase";

export default function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        pass: ""
    });
    const [errorMsg, setErrorMsg] = useState([]);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = (event) => {
        const email = event.target.value;
        setValues({ email, pass: "" });

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

    const handlePasswordChange = (event) => {
        const pass = event.target.value;
        setValues(prev => ({ ...prev, pass }));
    };

    const handleSubmit = () => {
        const newErrorMsgs = [];

        if (!values.email) {
            newErrorMsgs.push("Email not filled.");
        } else if (!isValidEmail(values.email)) {
            newErrorMsgs.push("Invalid Email Format");
        }

        if (!values.pass) {
            newErrorMsgs.push("Password not filled.");
        }

        setErrorMsg(newErrorMsgs);
        if (newErrorMsgs.length === 0) {
            signInWithEmailAndPassword(auth, values.email, values.pass)
                .then(() => {
                    navigate("/upload");
                })
                .catch((err) => {
                    switch (err.code) {
                        case 'auth/wrong-password':
                            setErrorMsg(["Incorrect password."]);
                            break;
                        case 'auth/user-not-found':
                            setErrorMsg(["Email not registered."]);
                            break;
                        case 'auth/invalid-email':
                            setErrorMsg(["Invalid Email Format."]);
                            break;
                        case 'auth/invalid-login-credentials':
                            setErrorMsg(["Invalid login credentials. Please try again."]);
                            break;
                        default:
                            setErrorMsg([err.message]);
                    }
                });
        }
    };

    return (
        <div className="wrapper">
            <div className="container main">
                <div className="row">
                    <div className="col-md-6 side-image1">
                        <img className="img1" src="../images/b1.jpg" alt="" />
                    </div>
                    <div className="col-md-6 right">
                        <div className="input-box">
                            <header><strong>Login</strong></header>
                            <div className="input-field">
                                <input
                                    type="text"
                                    className="input"
                                    id="email"
                                    required
                                    autoComplete="on"
                                    value={values.email}
                                    onChange={handleEmailChange}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    id="pass"
                                    value={values.pass}
                                    disabled={!isEmailValid}
                                    onChange={handlePasswordChange}
                                />
                                <label htmlFor="pass">Password</label>
                            </div>
                            {errorMsg.length > 0 &&
                                <div className="error-list">
                                    <ul>
                                        {errorMsg.map((error, index) => <li key={index}>{error}</li>)}
                                    </ul>
                                </div>
                            }
                            <div className="input-field">
                                <input type="submit" className="submit" value="Login" onClick={handleSubmit} />
                            </div>
                            <div className="signin">
                                {/* <span>Don't have an account? <Link to="/signup">Sign Up</Link></span> */}
                                <span>Don't have an account? <Link to="/">Sign Up</Link></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
