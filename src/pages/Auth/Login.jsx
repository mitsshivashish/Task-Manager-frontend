import React, { useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/ApiPaths";
import { UserContext } from "../../context/userContext";
import googleIcon from "../../assets/images/985_google_g_icon.jpg";
import { useLoading } from "../../context/loadingContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const { setDashboardLoading } = useLoading();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDashboardLoading(true); // Show dashboard skeleton immediately
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter the password");
      setLoading(false);
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, role } = response.data;
      if (token) {
        sessionStorage.setItem("token", token);
        updateUser(response.data);
      }
      //Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setDashboardLoading(false); // Hide skeleton if login fails
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_AUTH_URL = `${BASE_URL}/api/auth/google`;

  const handleGoogleSignIn = () => {
    setLoading(true);
    setDashboardLoading(true); // Show dashboard skeleton immediately
    window.location.href = GOOGLE_AUTH_URL;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-lg font-semibold">Loading...</div>;
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          ></Input>

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          ></Input>

          <div className="flex justify-end mb-2">
            <Link to="/forgot-password" className="text-blue-600 text-xs hover:underline">Forgot Password?</Link>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">LOGIN</button>
          <p className="text-[13px] text-slate-800 mt-3">Dont't have a account ? {" "}<Link className="font--medium text-primary underline" to="/signup">SignUp</Link></p>
        </form>
        <div className="flex flex-col items-center mt-4">
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded shadow bg-white hover:bg-gray-100"
            onClick={handleGoogleSignIn}
          >
            <img src={googleIcon} alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
