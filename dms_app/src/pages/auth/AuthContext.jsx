import { createContext, useState } from "react";

// Context object — consumed via useContext(AuthContext) anywhere in the tree
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Initialize from localStorage so state survives page refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole]   = useState(localStorage.getItem("role"));

  // Persists token and role to both localStorage and React state on successful login
  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  };

  // Clears all localStorage and resets React state on logout
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  return (
    // Provides token, role, login, logout to all child components
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
