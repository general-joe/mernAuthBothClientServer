import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  // Here, we are gonna create three stat variables which will help us store our user data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      //Here when we click on submit button it will prevent the browser from reload the page
      e.preventDefault();
      //Here we are gonna check if the state is equal to sign up or login
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        //If the state is equal to sign up then we will send a post request to the backend
        //we make api calls using axios
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          // alert("User created successfully")
          setIsLoggedin(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          // alert("User created successfully")
          setIsLoggedin(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      // toast.error(data.message);
      // Safely access error response and provide a fallback message
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 px-6 sm:px-0 flex items-center justify-center">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute top-5 left-5 sm:left-10 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        <form onSubmit={onSubmitHandler}>
          {/* we shoul hide some of the input fields based on the state and we are going to use state to determine which form to show */}
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none"
              type="password"
              placeholder="Enter Password"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot Password?
          </p>
          {/* we are using the state */}
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state}
          </button>
        </form>
        {/* we are going to use state to determine which text to show */}
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            {/* this curly braces give space between the p tag and the span tag */}
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            {/* this curly braces give space between the p tag and the span tag */}
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
