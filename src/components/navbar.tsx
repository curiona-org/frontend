"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.svg";
import { usePathname } from "next/navigation";

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authButtonText, setAuthButtonText] = useState("Sign In");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/sign-in") {
      setAuthButtonText("Sign Up");
    } else {
      setAuthButtonText("Sign In");
    }
  }, [pathname]);

  return (
    <div className="fixed w-full px-6 lg:px-40 py-6 flex justify-between z-50">
      <div className="flex gap-2 items-center">
        <Image src={Logo} alt="Logo" priority />
        <p className="text-3xl text-blue-500">Curiona</p>
      </div>

      {isLoggedIn ? (
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-blue-500">Dashboard</Link>
          <Link href="/settings" className="text-blue-500">Settings</Link>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span>U</span>
          </div>
        </div>
      ) : (
        <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
          <button className="w-32 py-3 bg-blue-500 hover:bg-blue-900 text-white-500 rounded-lg hidden lg:inline-block">
            {authButtonText}
          </button>
        </Link>
      )}
    </div>
  );
};

export default NavigationBar;
