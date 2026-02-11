import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/user-api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Run once on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    console.log("Token found in localStorage:", storedToken);

    // 🔐 Fetch real user from backend
    getCurrentUser()
      .then((res) => {
        setUser(res.data);  
        // console.log("User fetched:", res.data);
      })
      .catch(() => {
        // Token invalid or expired
        localStorage.removeItem("accessToken");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (accessToken) => {
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);

    // Fetch user immediately after login
    setLoading(true);
    getCurrentUser()
      .then((res) => {
        setUser(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
