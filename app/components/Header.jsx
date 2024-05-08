"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

function Header() {
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   if (storedUsername) {
  //     setUser(storedUsername);
  //   }
  // }, []);
  return (
    <nav className="bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 p-4 px-20 flex justify-between items-center">
      <h2 className="text-white font-medium uppercase drop-shadow-md text-xl">
        <Link href="/">Lost and Found System</Link>
      </h2>

      {user ? (
        <div className="bg-white rounded-full px-4 py-1 cursor-pointer">
          <p className="text-2xl flex flex-row gap-2 items-center text-white">
            👤 <span className="text-black text-sm">{user}</span>
          </p>
        </div>
      ) : (
        <>
          {" "}
          <div className="flex flex-row gap-3">
            <Button className="bg-black hover:bg-black-600" asChild>
              <Link href="/textsearch">
                <span className="text-xl text-white">Try our text search</span>
              </Link>
            </Button>
            <Button className="bg-white hover:bg-slate-200" asChild>
              <Link href="/login">
                <span className="text-xl text-black">⇢</span>
              </Link>
            </Button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Header;
