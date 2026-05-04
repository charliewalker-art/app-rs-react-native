import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);
export default AuthContext;