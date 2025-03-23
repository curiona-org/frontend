"use client";

import { useAuth } from "@/components/providers/auth-provider";
import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "/public/logo.svg";

const NavigationBar = () => {
  const { isLoggedIn, session } = useAuth();
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
    <div className='fixed w-full px-6 lg:px-40 py-6 flex justify-between z-50'>
      <div className='flex gap-2 items-center'>
        <Image src={Logo} alt='Logo' priority />
        <p className='text-3xl text-blue-500'>Curiona</p>
      </div>

      {isLoggedIn && session && (
        <div className='flex items-center gap-6'>
          <Link href='/dashboard' className='text-blue-500'>
            Dashboard
          </Link>
          <Link href='/settings' className='text-blue-500'>
            Settings
          </Link>
          <Image
            src={session.user.avatar}
            alt='User Avatar'
            width={40}
            height={40}
            className='rounded-full bg-gray-300 flex items-center justify-center'
          />
        </div>
      )}

      {!isLoggedIn && (
        <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
          <Button className='w-32 py-3 bg-blue-500 hover:bg-blue-900 text-white-500 rounded-lg hidden lg:inline-block'>
            {authButtonText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavigationBar;
