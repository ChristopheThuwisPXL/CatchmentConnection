import { useState, useEffect } from "react";

type User = {
  name: string;
  email: string;
  avatar: string;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (hasFetched) return;
    setHasFetched(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.email) {
            const freshUser: User = {
              name: data.name || "",
              email: data.email || "",
              avatar: data.avatar || "",
            };
            localStorage.setItem("user", JSON.stringify(freshUser));
            setUser(freshUser);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
        });
    }
  }, [hasFetched]);

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
