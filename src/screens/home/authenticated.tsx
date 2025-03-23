"use client";
import ButtonSignOut from "@/components/button-sign-out";
import { useAuth } from "@/providers/auth-provider";
import dayjs from "dayjs";
import Image from "next/image";

export default function HomeAuthenticated() {
  const { session } = useAuth();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Image
        src={session?.user.avatar as string}
        alt='Roadmap Generator Logo'
        width={200}
        height={200}
        className='rounded-full'
      />
      <span className='text-lg'>
        <span className='text-gray-500'>Name: </span>
        <span className='font-bold text-black'>{session?.user.name}</span>
      </span>
      <span className='text-lg'>
        <span className='text-gray-500'>Email: </span>
        <span className='font-bold text-black'>{session?.user.email}</span>
      </span>
      <span className='text-lg'>
        <span className='text-gray-500'>ID: </span>
        <span className='font-bold text-black'>{session?.user.id}</span>
      </span>
      <span className='text-lg'>
        <span className='text-gray-500'>Access Token Expires At: </span>
        <span className='font-bold text-black'>
          {dayjs(session?.tokens.access_token_expires_at).format(
            "dddd, d MMMM YYYY HH:mm:ss"
          )}
        </span>
      </span>
      <ButtonSignOut />
    </div>
  );
}
