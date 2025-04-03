import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const navigate = useNavigate()
    const {user, setUser} = useContext(UserDataContext)

    const apiUrl = import.meta.env.VITE_API_URL;

    const submitHandler = async (e) => {
      e.preventDefault();
      const user = {
        email,
        password,
      };

        const response = await axios.post(`${apiUrl}/api/login`, user)
        // console.log(response)

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }

      setEmail("");
      setPassword("");
    };

 

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to vote!
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="email@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg focus:outline-none hover:bg-blue-700"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
