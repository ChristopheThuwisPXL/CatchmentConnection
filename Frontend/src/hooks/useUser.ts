import { useState, useEffect } from "react";

type User = {
    name: string;
    email: string;
    avatar: string;
  };
  
  export function useUser() {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    const saveUser = (userData: Partial<User>) => {
      const fullUser: User = {
        name: userData.name || "",
        email: userData.email || "",
        avatar: userData.avatar || "",
      };
      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);
    };
  
    const clearUser = () => {
      localStorage.removeItem("user");
      setUser(null);
    };
  
    return { user, saveUser, clearUser };
  }
  
