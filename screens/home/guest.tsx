"use client";
import Link from "next/link";

export default function HomeGuest() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-2xl font-bold'>Welcome to Roadmap Generator</h1>
      <p>Sign in to continue</p>
      <Link href='/sign-in'>
        <button className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500'>
          Sign In
        </button>
      </Link>
      <Link href='/sign-up'>
        <button className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md focus:outline-none focus:ring focus:ring-blue-500'>
          Sign Up
        </button>
      </Link>
    </div>
  );
}
