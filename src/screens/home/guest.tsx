"use client";
import CommunityRoadmapList from "@/components/roadmap/community-roadmap-list";
import GenerateRoadmap from "@/components/roadmap/generate-roadmap";
import { ListRoadmapsOutput } from "@/types/api-roadmap";
import Link from "next/link";

type HomeGuestProps = {
  communityRoadmaps: ListRoadmapsOutput | null;
};

export default function HomeGuest({ communityRoadmaps }: HomeGuestProps) {
  return (
    <div className='flex items-center justify-center min-h-screen px-6 lg:px-72 py-32'>
      <div className='w-full flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap gap-4 items-center text-mobile-display-1 lg:text-display-1'>
            <h1>Create Your </h1>
            <span className='text-blue-500 dashedBorder px-2 md:px-5 py-1'>
              Learning Blueprint
            </span>
          </div>
          <h4 className='text-mobile-heading-4-regular lg:text-heading-4-regular'>
            Create a personalized roadmap that helps you learn new things
            without the hassle.
          </h4>
          <GenerateRoadmap />
        </div>

        <div className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <h4 className='col-span-4 text-mobile-heading-4-regular lg:text-heading-4-regular'>
              Or check out roadmaps others have created
            </h4>
            <Link href='/community'>
              <span className='col-span-8 text-nowrap text-mobile-body-1-regular lg:text-body-1-regular flex items-center gap-1 cursor-pointer hover:text-blue-500'>
                See More
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m10 17l5-5m0 0l-5-5'
                  />
                </svg>
              </span>
            </Link>
          </div>

          {communityRoadmaps && (
            <CommunityRoadmapList
              initialData={communityRoadmaps}
              search=''
              orderBy='newest'
              showPagination={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
