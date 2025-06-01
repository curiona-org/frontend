"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
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
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed w-full px-6 lg:px-72 py-6 flex justify-between z-50 transition-all ease-out duration-300 ${
        isScrolled ? "bg-white-500 shadow-md" : "bg-transparent"
      }`}
    >
      <Link href="/">
        <div className="flex gap-2 items-center">
          <Image src={Logo} alt="Logo" priority />
          <span className="text-heading-2 font-medium text-blue-500">
            Curiona
          </span>
        </div>
      </Link>

      <Link
        className="text-mobile-body-1-bold lg:text-body-1-bold"
        href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
      >
        <Button className="w-24 lg:w-[124px] h-11 bg-blue-500 hover:bg-blue-900 text-white-500">
          {authButtonText}
        </Button>
      </Link>
    </div>
  );
};

export default NavigationBarGuest;
