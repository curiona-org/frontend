import { auth } from "@/shared/auth";
import ButtonSignOut from "@/ui/sign-out";
import dayjs from "dayjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function HomeAuthenticated() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Image
        src={session.data.avatar as string}
        alt='Roadmap Generator Logo'
        width={200}
        height={200}
      />
      <span className='text-lg'>
        <span className='text-gray-500'>Name: </span>
        <span className='font-bold text-black'>{session.data.name}</span>
      </span>
      <span className='text-lg'>
        <span className='text-gray-500'>Email: </span>
        <span className='font-bold text-black'>{session.data.email}</span>
      </span>
      <span className='text-lg'>
        <span className='text-gray-500'>ID: </span>
        <span className='font-bold text-black'>{session.data.id}</span>
      </span>
      <span className='text-lg'>
        <span className='text-gray-500'>Access Token Expires At: </span>
        <span className='font-bold text-black'>
          {dayjs(session.data.tokens.access_token_expires_at).format(
            "dddd, d MMMM YYYY HH:mm:ss"
          )}
        </span>
      </span>
      <ButtonSignOut />
    </div>
  );
}
