"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    if (!email || !password) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-white">Login</h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          className="mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </Button>
      </Card>
    </div>
  );
}