import React from "react";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import SideBar from "@/app/components/SideBar";

const backgroundImage = 'url("/bg.jpeg")';

function DashLayout({ children }) {
  return (
    <ProtectedRoute>
      <div>
        <main
          style={{ backgroundImage }}
          className=" flex flex-row gap-14 min-h-screen overflow-y-hidden"
        >
          <SideBar />
          <div className="mt-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default DashLayout;
