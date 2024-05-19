"use client";
import React, { useEffect, useState } from "react";

function Pending() {
  const [count, setCount] = useState(null);

  useEffect(() => {
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

  return (
    <div
      className="flex items-center justify-center w-52 h-52 bg-white shadow-lg rounded-md"
      style={{ width: "200px", height: "200px" }}
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Pending Requests</h2>
        <p className="text-4xl font-bold">
          {count !== null ? count : "Loading..."}
        </p>
      </div>
    </div>
  );
}

export default Pending;
