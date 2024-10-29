"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useProviderFunction } from "./context/AppContext";
import {BsEye, BsEyeSlash} from 'react-icons/bs'

export default function AuthPage() {
  const { backendURL } = useProviderFunction();
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordOn, setIsPasswordOn] = useState(true);
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let url = backendURL;
    url += isLogin ? "/auth/login" : "/auth/register";
    try {
      const response = await axios.post(url, data);
      if (response.data.success) {
        toast.success(response.data.message);
        setData({username: "", password: "", email: ""});
        localStorage.setItem("token", response.data.token);
        window.location.reload(); //reload page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-200 max-w-[500px] w-full mx-auto shadow shadow-slate-400 p-2"
      >
        <h1 className="text-[22px] font-semibold text-center mb-6 mt-2">
          {isLogin ? "Login" : "Register"}
        </h1>
        <div className="mb-5">
          <input
            className="p-2 w-full border-b border-b-black focus:outline-none rounded-sm focus:bg-white bg-[inherit] "
            type="text"
            name="username"
            placeholder="Enter your username"
            onChange={handleChange}
            value={data.username}
          />
          <span className="text-red-500 px-2"></span>
        </div>
        <div className={`mb-5 ${isLogin ? "hidden" : ""}`}>
          <input
            className="p-2 w-full border-b border-b-black focus:outline-none rounded-sm focus:bg-white bg-[inherit] "
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={data.email}
          />
          <span className="text-red-500 px-2"></span>
        </div>
        <div className="mb-6 relative">
          <input
            className="p-2 w-full border-b border-b-black focus:outline-none rounded-sm focus:bg-white bg-[inherit] pr-[13%]"
            type={isPasswordOn ? "password" : "text"}
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={data.password}
          />
          {isPasswordOn ? (<BsEye className="absolute top-1/3 right-3 text-gray-600 cursor-pointer z-40" onClick={() => setIsPasswordOn(prev => !prev)} />) : (<BsEyeSlash className="absolute top-1/3 right-3 text-gray-600 cursor-pointer z-40" onClick={() => setIsPasswordOn(prev => !prev)} />)}
          
        </div>
        <button
          type="submit"
          className="bg-blue-500 grid mx-auto p-1.5 rounded text-white mb-5  hover:opacity-90"
        >
          {isLogin ? " Login" : "Create Account"}
        </button>

        <p className="text-center mb-3 text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-900 cursor-pointer underline hover:no-underline"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
}
