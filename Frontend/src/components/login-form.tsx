import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // API-aanroep voor login
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let response;
    if (isRegistering) {
      // Registreren - POST naar /signup van Flask backend
      response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    } else {
      // Inloggen - POST naar /login van Flask backend
      response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
    }

    const data = await response.json();

    if (response.ok) {
      // Succesvolle login/registratie
      alert(isRegistering ? "Check je e-mail om te bevestigen!" : "Succesvol ingelogd!");
      // Verwerk het succes, bijvoorbeeld door een state update of redirect
      window.location.reload();  // Vervang dit met state update voor betere UX
    } else {
      // Fout bij login of registratie
      setError(data.error || "Er is iets mis gegaan. Probeer het opnieuw.");
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
    </form>
  );
}
