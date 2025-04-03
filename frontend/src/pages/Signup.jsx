import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const {user, setUser} = useContext(UserDataContext)
  console.log(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
        fullname: {
            firstName: firstName,
            lastName: lastName
        },
        email: email,
        password: password,
    }

    const response = await axios.post(`${apiUrl}/api/signup`, newUser)
    console.log(response);

    if(response.status === 201){
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home")
    }

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={submitHandler}>
          <h3 className="text-lg w-full font-medium mb-2">What's your name</h3>
          <div className="flex gap-3 mb-7">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-sm mb-2">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-sm mb-2">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            id="email"
            name="email"
            required
            placeholder="email@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
          />
          <h3 className="text-lg font-medium mb-2">Enter password</h3>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
          />
          <button
            type="submit"
            className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg"
          >
            Create account
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
