"use client";
import ButtonSignOut from "@/components/button-sign-out";
import { useAuth } from "@/providers/auth-provider";
import RoadmapList from "@/components/roadmap/roadmap-list";
import GenerateRoadmap from "@/components/roadmap/generate.roadmap";
// import dayjs from "dayjs";
// import Image from "next/image";

export default function HomeAuthenticated() {
  const { session } = useAuth();

  return (
    <div className="justify-center min-h-screen px-6 lg:px-40 py-32">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center font-satoshi text-display-1">
            <h1>Create Your </h1>
            <span className="text-blue-500 dashedBorder px-5 py-1">
              Learning Blueprint
            </span>
          </div>
          <p className="font-satoshi text-heading-4-regular">
            Create a personalized roadmap that helps you learn new things
            without the hassle.
          </p>
          <GenerateRoadmap />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h4 className="font-satoshi text-heading-4-regular">
              Type here to generate your roadmap
            </h4>
            <span className="font-satoshi text-body-1-regular flex items-center gap-1 cursor-pointer hover:text-blue-500">
              See More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m10 17l5-5m0 0l-5-5"
                />
              </svg>
            </span>
          </div>

          <RoadmapList />
        </div>
        <ButtonSignOut />
      </div>
    </div>
    // <div className='flex flex-col items-center justify-center min-h-screen py-2'>
    //   <Image
    //     src={session?.user.avatar as string}
    //     alt='Roadmap Generator Logo'
    //     width={200}
    //     height={200}
    //     className='rounded-full'
    //   />
    //   <span className='text-lg'>
    //     <span className='text-gray-500'>Name: </span>
    //     <span className='font-bold text-black'>{session?.user.name}</span>
    //   </span>
    //   <span className='text-lg'>
    //     <span className='text-gray-500'>Email: </span>
    //     <span className='font-bold text-black'>{session?.user.email}</span>
    //   </span>
    //   <span className='text-lg'>
    //     <span className='text-gray-500'>ID: </span>
    //     <span className='font-bold text-black'>{session?.user.id}</span>
    //   </span>
    //   <span className='text-lg'>
    //     <span className='text-gray-500'>Access Token Expires At: </span>
    //     <span className='font-bold text-black'>
    //       {dayjs(session?.tokens.access_token_expires_at).format(
    //         "dddd, d MMMM YYYY HH:mm:ss"
    //       )}
    //     </span>
    //   </span>
      // <ButtonSignOut />
    // </div>
  );
}
