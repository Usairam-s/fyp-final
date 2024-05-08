"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const router = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      window.location.href = "/login";
    } else {
      setUser(storedUsername);
    }
  }, [router]);

  return <>{children}</>;
}

export default ProtectedRoute;
