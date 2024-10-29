"use client"
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const token = localStorage.getItem('token');
  setIsAuthenticated(!!token);
  setLoading(false);
  }, []);

  if(loading) return "loading....";

  if(!isAuthenticated) {
    return <AuthPage /> 
  }
  return (
    <div>
      <Dashboard />
    </div>
  )
}