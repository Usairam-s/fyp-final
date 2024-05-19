"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.ok) {
      window.location.href = "/setuser";
    } else {
      alert("Invalid credentials");
    }
  };
  return (
    <div className="pt-14">
      <div className="mx-auto flex justify-center py-10 rounded-lg drop-shadow-2xl   items-center flex-col w-[400px] bg-slate-300">
        <h1 className="font-semibold text-6xl my-4 text-white"> 🔐 </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-[350px] pb-4 "
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Button className="bg-purple-600 hover:bg-purple-700" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
