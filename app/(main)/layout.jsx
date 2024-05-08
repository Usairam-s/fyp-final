import React from "react";
import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main className=" min-h-screen overflow-y-hidden">{children}</main>
    </div>
  );
}

export default MainLayout;
