"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    // Ab ye server-side variables se compare karega
    // Note: process.env.NEXT_PUBLIC_ prefix use karna hoga Vercel mein
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
        password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setIsAdmin(true);
    } else {
      alert("Unauthorized Access!");
    }
  };

  // ... baki ka login UI same rahega
