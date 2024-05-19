"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function Pending() {
  const [count, setCount] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchPendingCount = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/allrequestscount"
        );
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error("Error fetching pending count:", error);
      }
    };

    fetchPendingCount();
  }, []);

  if (!mounted) {
    // Return a placeholder that is consistent between server and client
    return (
      <div
        className="flex mt-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 border border-slate-300 items-center justify-center w-60 h-80 shadow-lg rounded-md"
        style={{ width: "200px", height: "200px" }}
      >
        <div className="text-center relative text-white">
          <h2 className="text-xl mb-1 font-semibold">
            Pending <br /> Requests
          </h2>
          <p className="text-4xl font-bold">
            <span className="animate-bounce text-2xl">....</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex mt-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 border border-slate-300 items-center justify-center w-60 h-60 shadow-lg rounded-md"
      style={{ width: "200px", height: "200px" }}
    >
      <div className="text-center relative text-white">
        {count !== null && (
          <Link href="/dashboard/allrequests">
            <div className="absolute -top-[52px] rotate-[45deg] left-[120px] bg-black h-7 w-7 text-center items-center justify-center flex rounded-full">
              ⬆
            </div>
          </Link>
        )}
        <h2 className="text-xl mb-1 font-semibold">
          Pending <br /> Requests
        </h2>
        <p className="text-4xl font-bold">
          {count !== null ? (
            count
          ) : (
            <span className="animate-pulse text-4xl">....</span>
          )}
        </p>
      </div>
    </div>
  );
}

export default Pending;
