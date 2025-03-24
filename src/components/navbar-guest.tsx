"use client";

import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "/public/logo.svg";

const NavigationBarGuest = () => {
  const [authButtonText, setAuthButtonText] = useState("Sign In");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/sign-in") {
      setAuthButtonText("Sign Up");
    } else {
      setAuthButtonText("Sign In");
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed w-full px-6 lg:px-40 py-6 flex justify-between z-50 transition-all duration-300 ${
        isScrolled ? "bg-white-500 shadow-md" : "bg-transparent"
      }`}
    >
      <Link href="/">
        <div className="flex gap-2 items-center">
          <Image src={Logo} alt="Logo" priority />
          <p className="text-3xl text-blue-500">Curiona</p>
        </div>
      </Link>

      <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
        <Button className="w-32 py-3 bg-blue-500 hover:bg-blue-900 text-white-500 rounded-lg hidden lg:inline-block">
          {authButtonText}
        </Button>
      </Link>
    </div>
  );
};

export default NavigationBarGuest;
