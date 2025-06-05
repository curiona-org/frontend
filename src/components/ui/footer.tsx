"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "/public/logo-white.svg";

const Footer = () => {
  const pathname = usePathname();

  const hideFooterPages = ["/sign-in", "/sign-up", "/personalization"];

  if (pathname.startsWith("/roadmap")) {
    return null;
  }

  if (hideFooterPages.includes(pathname)) {
    return null;
  }

  return (
    <footer className='w-full bg-[#001F4D] text-white px-6 lg:px-40 py-10 font-satoshi text-body-1-regular'>
      <div className='flex flex-col md:flex-row md:justify-between items-center gap-8'>
        <div className='flex flex-col items-center md:items-start gap-4'>
          <div className='flex gap-2 items-center'>
            <Image src={Logo} alt='Logo' priority />
            <span className='block text-heading-2 font-medium text-white-500'>
              Curiona
            </span>
          </div>
          <p className='text-white-500 text-center md:text-left max-w-xs'>
            Curiona is a roadmap generator that provides personalized learning
            blueprints, empowering you to discover and master new skills.
          </p>
        </div>

        <div className='flex flex-wrap justify-center md:justify-end gap-6 text-white-500'>
          <Link href='/' className='hover:text-blue-500 hover:underline'>
            Generate
          </Link>
          <Link href='/' className='hover:text-blue-500 hover:underline'>
            Community
          </Link>
        </div>
      </div>

      <div className='mt-8 flex flex-col md:flex-row justify-center md:justify-between text-center text-white-500'>
        <p>
          Created By <span className='font-bold'>Dastin Darmawan</span>,{" "}
          <span className='font-bold'>Juan Christian</span> and{" "}
          <span className='font-bold'>Owen Farida</span>
        </p>
        <p>Curiona © 2025, All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
