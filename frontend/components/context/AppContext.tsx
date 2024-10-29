"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type ContextTypes = {
  backendURL: string;
  token: string | null | undefined,
};

export const AppContext = createContext<ContextTypes | undefined>(undefined);

export default function ProviderFunction(props: { children: React.ReactNode }) {
  const backendURL = "http://localhost:5000";
  const [token, setToken] = useState<string | null | undefined>(null);
  const [blogList, setBlogList] = useState([]);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if(storedToken) {
        setToken(storedToken);
    }
  }, []);


  return (
    <AppContext.Provider value={{ backendURL, token }}>
      {props.children}
    </AppContext.Provider>
  );
}

export function useProviderFunction() {
  const context = useContext(AppContext);
  if (!context) throw new Error("Context Not Found");
  return context;
}
