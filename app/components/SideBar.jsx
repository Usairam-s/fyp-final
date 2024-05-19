"use client";

import { Sidebar } from "flowbite-react";

import { IoMdHome } from "react-icons/io";
import { IoIosListBox } from "react-icons/io";
import { ImUpload3 } from "react-icons/im";
import { VscThreeBars } from "react-icons/vsc";
import { BsInboxesFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

function SideBar() {
  const router = useRouter();
  const handleSignOut = () => {
    localStorage.removeItem("username"); // Remove the token from local storage
    router.push("/login"); // Redirect to the login page or any other page
  };
  return (
    <Sidebar aria-label="Sidebar min-h-screen  ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-3">
          <Sidebar.Item href="/dashboard" icon={IoMdHome}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/tagandvenue" icon={IoIosListBox}>
            Tags and Venues
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/upload" icon={ImUpload3}>
            Upload Item
          </Sidebar.Item>
          <Sidebar.Item href="/dashboard/allrequests" icon={VscThreeBars}>
            All Requests
          </Sidebar.Item>
          {/* <Sidebar.Item href="/dashboard/lostitems" icon={BsInboxesFill}>
            Lost Items
          </Sidebar.Item> */}
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            className="bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white text-center cursor-pointer"
            onClick={handleSignOut}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SideBar;
