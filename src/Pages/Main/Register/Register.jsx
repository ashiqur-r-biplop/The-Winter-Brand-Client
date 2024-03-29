/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, useToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, sendEmailVerification } from "firebase/auth";

import { AuthContext, auth, useAuth } from "../../../AuthProvider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import HelmetSeo from "../../../Component/shared/Helmet";
import Swal from "sweetalert2";

const Register = () => {
  const { user } = useAuth();
  console.log(13, user);
  const [toggleIcon, setToggleIcon] = useState(true);
  const [errorMassage, setErrorMassage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const {
    signUp,
    controlCart,
    setControlCart,
    updateProfileControl,
    setNevActive,
    setUpdateProfileControl,
  } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { axiosSecure } = useAxiosSecure();
  const from = location.state?.from?.pathname || "/";

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e?.target;
    const email = form?.email?.value;
    const name = form?.name?.value;
    const password = form?.password?.value;
    if (password < 6) {
      setErrorMassage("Minimum six characters provide your password");
      setSuccessMessage("");
      return;
    } else if (!/^(?=.*[A-Za-z])/.test(password)) {
      setErrorMassage("At least one letter");
      setSuccessMessage("");
    } else {
      signUp(email, password)
        .then((result) => {
          const saveUser = result.user;
          console.log(42, saveUser.email);
          sendEmailVerification(saveUser)
            .then((res) => {
              console.log(45, res);
              setVerificationMessage("please check your email to verify");
              axiosSecure
                .post("/user-registration", {
                  name: name,
                  email: saveUser.email,
                })
                .then((data) => {
                  // console.log(object);
                  if (data?.data?.success) {
                    Swal.fire({
                      title: "Registration Successful!",
                      text: "Please check your email to verify!",
                      icon: "success",
                      showCancelButton: false,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Ok",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate(from, { replace: true });
                        setUpdateProfileControl(!updateProfileControl);
                        setNevActive("home");
                      }
                    });
                    form.reset();
                    setControlCart(!controlCart);

                    setErrorMassage("");
                    setSuccessMessage("");
                  }
                })
                .catch((err) => {
                  console.log(err?.message);
                });
            })
            .catch((err) => {
              console.log(47, err.message);
            });
          console.log(saveUser);
        })
        .catch((err) => {
          console.log(err.message);
          setErrorMassage(err.message);
          setSuccessMessage("");
        });
    }
  };
  const handleEmail = (e) => {
    const emailHandle = e.target.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailHandle)) {
      setErrorMassage("Email are not valid");
      return;
    } else {
      setErrorMassage("");
      setSuccessMessage("Email validation is complete");
    }
  };
  const handlePassword = (e) => {
    const passwordHandle = e.target.value;
    // console.log(passwordHandle);
    if (passwordHandle?.length < 6) {
      setErrorMassage("Minimum six characters provide your password");
      setSuccessMessage("");
      return;
    } else if (!/^(?=.*[A-Za-z])/.test(passwordHandle)) {
      setErrorMassage("At least one letter");
      setSuccessMessage("");
    } else {
      setErrorMassage("");
      setSuccessMessage("The password is hard to complete");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-0">
      <HelmetSeo
        title="Registration"
        canonical="register"
        description="register your account in the winter brand"
      />
      <div className="flex flex-col justify-center items-center">
        <h2 className="my-5 text-2xl font-semibold">
          Create your The Winter Brand account
        </h2>
        <div className="md:w-[400px]">
          <form
            onSubmit={handleRegister}
            className="flex flex-col justify-start items-start w-full md:w-[400px]"
          >
            <div className="flex flex-col md:w-[400px] w-full">
              <label htmlFor="name" className="py-5">
                <span className="text-red-600">*</span>Name
              </label>
              <input
                className="outline-none border-2 px-3 py-1"
                type="text"
                name="name"
                placeholder="enter your name"
                id="name"
              />
            </div>

            <div className="flex flex-col md:w-[400px] w-full">
              <label htmlFor="email" className="py-5">
                <span className="text-red-600">*</span> Email Address
              </label>
              <input
                className="outline-none border-2 px-3 py-1"
                type="email"
                name="email"
                onChange={handleEmail}
                placeholder="email"
              />
            </div>
            <div className="flex flex-col md:w-[400px] w-full">
              <label htmlFor="Password" className="py-5">
                <span className="text-red-600">*</span> Password
              </label>

              <div className="relative">
                <input
                  type={toggleIcon ? "password" : "text"}
                  className="outline-none border-2 px-3 py-1 w-full"
                  name="password"
                  placeholder="Password"
                  onChange={handlePassword}
                />
                {verificationMessage && (
                  <p>
                    {" "}
                    <span className="text-red-600 font-bold">Note: </span>
                    {verificationMessage}
                  </p>
                )}
                {errorMassage && <p className="text-red-600">{errorMassage}</p>}
                {successMessage && (
                  <p className="text-green-600">{successMessage}</p>
                )}
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
              value="Create account"
            />
          </form>
          <p>
            Already have an Account?
            <span className="text-[#4CA7FF] font-medium">
              <Link to="/login">Please Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
