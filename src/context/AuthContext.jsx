import { createContext, useContext, useState, useEffect } from "react";
import api from "./../servics/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set token in API client headers
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`; // Set token after login
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`; // Set token after register
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"]; // Remove token from API client
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
