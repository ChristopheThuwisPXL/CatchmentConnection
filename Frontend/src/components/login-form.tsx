import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { saveUser } = useUser();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = isRegistering ? "http://localhost:5000/signup" : "http://localhost:5000/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to authenticate.");
      }

      if (isRegistering) {
        setShowSuccessDialog(true);
        setEmail("");
        setPassword("");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      const userResponse = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${data.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const userData = await userResponse.json();
      saveUser({
        name: userData.name || "",
        email: userData.email || "",
        avatar: ""
      });
      navigate("/dashboard");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleAuth} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{isRegistering ? "Create an account" : "Login to your account"}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {isRegistering ? "Sign up with your email" : "Enter your email below to login"}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          {isRegistering ? "Sign up" : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button type="button" className="underline underline-offset-4" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Login here" : "Sign up here"}
        </button>
      </div>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Signup Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Please check your inbox and confirm your email address. After that, you can login!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsRegistering(!isRegistering)}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
