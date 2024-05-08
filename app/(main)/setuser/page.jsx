"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { usePathname } from "next/navigation";
import ProfileCard from "@/app/components/ProfileCard";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SetUser() {
  const router = usePathname();
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  useEffect(() => {
    if (username) {
      toast.success("Successfully Logged in !", {
        position: "top-center",
      });
      setUser(username); // Set user only if username exists

      localStorage.setItem("username", username);
    }
  }, [username]); // Trigger effect when username changes

  useEffect(() => {
    if (router === "/dashboard") {
    }
  }, [router]);

  return (
    <>
      {!user ? (
        <ProfileCard onSelect={setUser} />
      ) : (
        <>
          <div className="flex justify-center items-center h-screen">
            <div className="mx-auto -mt-10 text-center animate-spin text-3xl text-primary font-semibold">
              <span className="text-9xl">❖</span>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default SetUser;
