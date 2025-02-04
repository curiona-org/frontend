"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomeAuthenticated() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <img
        src={session.user?.image as string}
        alt='Roadmap Generator Logo'
        width={200}
        height={200}
      />
      Signed in as {session.user?.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
