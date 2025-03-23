"use client";

import { useAuth } from "@/providers/auth-provider";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.svg";

const NavigationBarAuthenticated = () => {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  return (
    <div className='fixed w-full px-6 lg:px-40 py-6 flex justify-between z-50'>
      <div className='flex gap-2 items-center'>
        <Image src={Logo} alt='Logo' priority />
        <p className='text-3xl text-blue-500'>Curiona</p>
      </div>
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
    </div>
  );
};

export default NavigationBarAuthenticated;
