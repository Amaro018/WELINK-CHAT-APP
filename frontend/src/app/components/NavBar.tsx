"use client";
import Link from "next/link";
import { User } from "../models/user";
import { useEffect, useState } from "react";
import * as userApi from "../network/user_api";
import { useRouter } from "next/navigation";
import { IconButton, Drawer, Skeleton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // New state for loading
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await userApi.getUser();
        setCurrentUser(user);
      } catch (error) {
        console.log("Ignoring error when fetching user:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    }
    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await userApi.logout();
      setCurrentUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="bg-slate-700 px-6 sm:px-12 md:px-16 py-4 text-white">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">WeLink</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {loading ? (
            // Skeleton Loader
            <>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={80} height={24} />
              <Skeleton variant="rectangular" width={90} height={36} />
            </>
          ) : currentUser ? (
            <>
              <p>Logged in as: {currentUser.username}</p>
              <Link href="/" className="hover:text-slate-200">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-slate-200">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-slate-500 hover:text-slate-200 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-slate-200">
                Home
              </Link>
              <Link href="/login" className="hover:text-slate-200">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div className="w-60 p-4 flex flex-col gap-3">
          {loading ? (
            // Skeleton Loader in Mobile Drawer
            <>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="rectangular" width={90} height={36} />
            </>
          ) : currentUser ? (
            <>
              <p className="text-lg font-semibold">
                Logged in as: {currentUser.username}
              </p>
              <Link href="/dashboard" className="hover:text-slate-200">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-stone-500 hover:text-slate-200 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="hover:text-slate-200">
                Sign Up
              </Link>
              <Link href="/login" className="hover:text-slate-200">
                Login
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}
