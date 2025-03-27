"use client";
import React, { useEffect, useState } from "react";
import * as userApi from "../../network/user_api";
import { LoginCredentials } from "@/app/network/user_api";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import { TextField } from "@mui/material";
import { User } from "@/app/models/user";

export default function LoginForm() {
  const [form, setForm] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const user = await userApi.getUser();

        setCurrentUser(user);
      } catch (error) {
        console.log("No user logged in, displaying login form.", error);
      }
    }
    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Logging in with form:", form);
    e.preventDefault();
    try {
      const user = await userApi.login(form);

      console.log("User logged in successfully:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please try again.");
    }
  };

  if (currentUser) {
    router.push("/dashboard");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-stone-300 min-h-screen px-4">
        <div className="absolute top-0 w-full">
          <NavBar />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-stone-200 p-6 rounded-lg w-full max-w-md sm:w-1/3"
        >
          <h1 className="text-2xl font-bold text-center dark:text-slate-700">
            Admin Login
          </h1>

          <TextField
            label="Username"
            fullWidth
            name="username"
            value={form.username}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Password"
            fullWidth
            name="password"
            value={form.password}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            type="password"
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
