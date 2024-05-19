"use client";
import { useState, useEffect } from "react";
import React from "react";
import { BarChartBig, CalendarDays } from "lucide-react";
import Pending from "../../components/Pending";

function Dashboard() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, []);
  return (
    <>
      <div className="border rounded-lg shadow-md w-full flex gap-80 flex-row justify-between p-4">
        <div className="flex flex-row gap-3 items-center">
          <BarChartBig className="text-blue-600" size={45} />

          <div className="flex flex-col ">
            <span className="font-semibold">Statistics</span>
            <span className="text-sm">
              Date: {new Date().toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-row gap-10 border-2 p-2 rounded-lg">
            <div className="flex flex-row gap-1 items-center">
              <CalendarDays size={20} />
              <span>This Month</span>
            </div>
            <div className="flex flex-col items-center">
              <span className=" text-purple-600">Request</span>

              <span className="font-medium"> 10 reported</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-yellow-600">Lost Items</span>

              <span className="font-medium"> 33 found</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Pending />
      </div>
    </>
  );
}

export default Dashboard;
