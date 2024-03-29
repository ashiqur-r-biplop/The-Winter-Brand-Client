import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
import { useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { baseURL } from "../../../hooks/useAxiosSecure";
import HelmetSeo from "../../../Component/shared/Helmet";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Swal from "sweetalert2";
const Login = () => {
  const [toggleIcon, setToggleIcon] = useState(true);
  const {
    login,
    controlCart,
    setControlCart,
    updateProfileControl,
    setUpdateProfileControl,
    setNevActive,
  } = useContext(AuthContext);
  const [errorMassage, setErrorMassage] = useState("");
  const [successMassage, setSuccessMassage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const emailField = form.email.value;
    setErrorMassage("");
    const passwordField = form.password.value;
    login(emailField, passwordField)
      .then((result) => {
        const loggedUser = result.user;
        axios
          .post(baseURL + "/login-user", {
            email: loggedUser.email,
          })
          .then((res) => "");
        setSuccessMassage("login successful");
        setNevActive("home");
        setErrorMassage("");
        setControlCart(!controlCart);
        setUpdateProfileControl(!updateProfileControl);
        navigate(from, { replace: true });
      })
      .catch((err) => {
        setSuccessMassage("");
        setErrorMassage(err.message);
      });
  };

  const [resetEmail, setResetEmail] = useState("");
  const auth = getAuth();
  const handleResetPassword = () => {
    if (!resetEmail) {
      alert("Please Enter Email!");
      return;
    }
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Please check your email!`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `${error.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
        // ..
      });
  };
  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-0">
      <HelmetSeo
        title="Login"
        canonical="login"
        description="login the winter brand account"
      />
      <div className="flex flex-col justify-center items-center md:h-[90vh]">
        <h2 className="my-5 text-2xl font-semibold">
          Login to your The Winter Brand account
        </h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-start items-start w-full md:w-[400px]"
        >
          <div className="flex flex-col md:w-[400px] w-full">
            <label htmlFor="email" className="py-5">
              <span className="text-red-600">*</span> Email Address
            </label>
            <input
              onChange={(e) => setResetEmail(e?.target?.value)}
              className="outline-none border-2 px-3 py-1"
              type="email"
              name="email"
              placeholder="email"
            />
          </div>
          <div className="flex flex-col md:w-[400px] w-full">
            <label htmlFor="Password" className="py-5">
              <span className="text-red-600">*</span> Password
            </label>
            <div className="relative">
              <div>
                <input
                  type={toggleIcon ? "password" : "text"}
                  className="outline-none border-2 px-3 py-1 w-full"
                  name="password"
                  placeholder="Password"
                />
                {errorMassage && <p className="text-red-600">{errorMassage}</p>}
                {successMassage && (
                  <p className="text-green-600">{successMassage}</p>
                )}
              </div>
              <div className="absolute top-2 right-4 text-xl cursor-pointer">
                {toggleIcon ? (
                  <FaEye onClick={() => setToggleIcon(!toggleIcon)}></FaEye>
                ) : (
                  <FaEyeSlash
                    onClick={() => setToggleIcon(!toggleIcon)}
                  ></FaEyeSlash>
                )}
              </div>
            </div>
          </div>
          <input
            className="brand-btn transition-all ease-in-out cursor-pointer w-full mx-auto my-5  py-2"
            type="submit"
            value="Login"
          />
        </form>
        <p>
          Don't Have an Account ?
          <span className="text-[#4CA7FF] font-medium">
            <Link to="/register">Please Register</Link>
          </span>
        </p>
        <p className="py-3">
          Forgot your password?{" "}
          <span
            onClick={handleResetPassword}
            className="text-[#4CA7FF] cursor-pointer"
          >
            Reset password
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
