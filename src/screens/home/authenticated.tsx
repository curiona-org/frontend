"use client";
import CommunityRoadmapList from "@/components/roadmap/community-roadmap-list";
import GenerateRoadmap from "@/components/roadmap/generate-roadmap";
import UserRoadmapList from "@/components/roadmap/user-roadmap-list";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { useEffect, useState } from "react";

const roadmapService = new RoadmapService();

export default function HomeAuthenticated() {
  const { session } = useAuth();
  const [userHasRoadmaps, setUserHasRoadmaps] = useState(false);

  useEffect(() => {
    if (!session || !session.user?.id) return;

    const loginKey = `login_${session.user.id}`;

    const hasRefreshed = sessionStorage.getItem(loginKey);
    if (!hasRefreshed) {
      // Belum pernah refresh untuk akun ini, lakukan refresh dan set flag
      sessionStorage.setItem(loginKey, "true");
      window.location.reload();
    }

    const checkUserRoadmaps = async () => {
      const roadmaps = await roadmapService.listUserRoadmap();
      setUserHasRoadmaps(roadmaps.data.items.length > 0);
    };
    checkUserRoadmaps();
  }, [session]);

  return (
    <div className='flex justify-center min-h-screen px-6 lg:px-40 xl:px-72 py-32'>
      <div className='flex flex-col gap-10'>
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

        {userHasRoadmaps && (
          <div className='flex flex-col'>
            <div className='flex justify-between items-center'>
              <h4 className='text-mobile-heading-4-regular lg:text-heading-4-regular'>
                Your Recently Generated Roadmap
              </h4>
              <Link href='/profile'>
                <span className='text-mobile-body-1-regular lg:text-body-1-regular flex items-center gap-1 cursor-pointer hover:text-blue-500'>
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
            <UserRoadmapList showPagination={false} />
          </div>
        )}

        <div className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <h4 className='text-mobile-heading-4-regular lg:text-heading-4-regular w-[240px] md:w-full'>
              Or check out roadmaps others have created
            </h4>
            <Link href='/community'>
              <span className='text-nowrap text-mobile-body-1-regular lg:text-body-1-regular flex items-center gap-1 cursor-pointer hover:text-blue-500'>
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

          <CommunityRoadmapList
            search=''
            orderBy='newest'
            showPagination={false}
            limit={6}
          />
        </div>
      </div>
    </div>
  );
}
