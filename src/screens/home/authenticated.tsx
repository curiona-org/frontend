"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { RoadmapService } from "@/lib/services/roadmap.service";
import UserRoadmapList from "@/components/roadmap/user-roadmap-list";
import CommunityRoadmapList from "@/components/roadmap/community-roadmap-list";
import GenerateRoadmap from "@/components/roadmap/generate-roadmap";
import PersonalizeRoadmap from "@/screens/personalization/personalize-roadmap";
import Link from "next/link";

const roadmapService = new RoadmapService();

export default function HomeAuthenticated() {
  const { session } = useAuth();
  const [topic, setTopic] = useState("");
  const [userHasRoadmaps, setUserHasRoadmaps] = useState(false);

  useEffect(() => {
    const checkUserRoadmaps = async () => {
      const roadmaps = await roadmapService.listUserRoadmap();
      setUserHasRoadmaps(roadmaps.data.items.length > 0);
    };
    checkUserRoadmaps();
  }, [session]);

  return (
    <div className="justify-center min-h-screen px-6 md:px-[80px] lg:px-[200px]  xl:px-[160px] 2xl:px-[320px] py-32">
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

        {topic && (
          <div className="flex flex-col">
            <PersonalizeRoadmap topic={topic} />
          </div>
        )}

        {userHasRoadmaps && (
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <h4 className="text-heading-4-regular">
                Your Recently Generated Roadmap
              </h4>
              <Link href="/profile">
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
              </Link>
            </div>
            <UserRoadmapList showPagination={false}/>
          </div>
        )}

        {/* Tetap tampilkan RoadmapList dan SignOut button */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h4 className="text-heading-4-regular">
              Or check out roadmaps others have created
            </h4>
            <Link href="/community">
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
            </Link>
          </div>

          <CommunityRoadmapList search="" orderBy="newest" showPagination={false} limit={6}/>
        </div>
      </div>
    </div>
  );
}
