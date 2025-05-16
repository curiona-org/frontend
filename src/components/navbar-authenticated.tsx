"use client";

import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.svg";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import ButtonSignOut from "@/components/button-sign-out";
import { useEffect, useState } from "react";

const NavigationBarAuthenticated = () => {
  const { session } = useAuth();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 w-full px-6 lg:px-40 py-6 flex justify-between  transition-all ease-out duration-300 ${
        isScrolled ? "bg-white-500 shadow-md" : "bg-transparent"
      }`}
    >
      <Link href="/">
        <div className="flex gap-2 items-center">
          <Image src={Logo} alt="Logo" priority />
          <span className="text-3xl font-medium text-blue-500">Curiona</span>
        </div>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          className={`font-satoshi p-3 ${
            pathname === "/"
              ? "text-body-1-bold text-blue-500 dashedBorder"
              : "text-body-1-regular text-black-500 hover:text-blue-500"
          }`}
        >
          Generate Roadmap
        </Link>

        <Link
          href="/community"
          className={`font-satoshi p-3 ${
            pathname === "/community"
              ? "text-body-1-bold text-blue-500 dashedBorder"
              : "text-body-1-regular text-black-500 hover:text-blue-500"
          }`}
        >
          Community Roadmap
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Radix UI Dropdown for Profile */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src={session.user.avatar}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full bg-gray-300 flex items-center justify-center"
              />
              <p className="text-body-1-medium font-semibold text-black-500">
                {session.user.name}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                className="-rotate-90"
              >
                <path
                  fill="currentColor"
                  d="M12.727 3.687a1 1 0 1 0-1.454-1.374l-8.5 9a1 1 0 0 0 0 1.374l8.5 9.001a1 1 0 1 0 1.454-1.373L4.875 12z"
                />
              </svg>
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-white-500 border rounded-md shadow-lg p-2 w-48 mt-2">
            <Link href="/profile">
              <DropdownMenu.Item className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">
                My Profile
              </DropdownMenu.Item>
            </Link>
            <DropdownMenu.Item className="px-4 py-2 text-sm text-gray-700 hover:bg-red-50 cursor-pointer">
              <ButtonSignOut />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default NavigationBarAuthenticated;
