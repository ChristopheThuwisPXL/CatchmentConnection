import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { AccountAvatarUpload } from "@/components/account/account-avatar";

import { AccountProfile } from "@/components/account/account-profile";
import { AccountSecurity } from "@/components/account/account-security";
import { AccountDangerZone } from "@/components/account/account-dangerzone";

export default function Account() {
  const { user, saveUser, clearUser } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:5000/user", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
  
        const data = await response.json();
        saveUser({
          name: data.name || "",
          email: data.email || "",
          avatar: ""
        });
      } catch (error: unknown) {
        console.error(error);
      }
    };
  
    fetchUserData();
  }, [navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: user?.name, email: user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleAccountDeletion = async () => {
    const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmation) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      clearUser();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const showYearPicker = false;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
        <div className="flex flex-col gap-6 p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your account details, security settings, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {user && (
              <>
                <AccountProfile
                  user={user}
                  setUser={(newUser) => saveUser(newUser)}
                  onSave={handleProfileUpdate}
                />
                <AccountAvatarUpload
                  user={user}
                  setUser={(newUser) => saveUser(newUser)}
                  />
                </>
              )}
            <AccountSecurity
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              setCurrentPassword={setCurrentPassword}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
            />
            <AccountDangerZone onDeleteAccount={handleAccountDeletion} />
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
