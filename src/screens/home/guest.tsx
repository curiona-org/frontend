"use client";
import GenerateRoadmap from "@/components/roadmap/generate-roadmap";
import CommunityRoadmapList from "@/components/roadmap/community-roadmap-list";

export default function HomeGuest() {
  return (
    <div className="justify-center min-h-screen px-6 lg:px-40 py-32">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center text-mobile-display-1 md:text-display-1">
            <h1>Create Your </h1>
            <span className="text-blue-500 dashedBorder px-5 py-1">
              Learning Blueprint
            </span>
          </div>
          <p className="text-mobile-heading-4-regular md:text-heading-4-regular">
            Create a personalized roadmap that helps you learn new things
            without the hassle.
          </p>
          <GenerateRoadmap />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <h4 className="text-mobile-heading-4-regular md:text-heading-4-regular">
              Type here to generate your roadmap
            </h4>
            <span className="text-mobile-body-1-regular md:text-body-1-regular flex items-center gap-1 cursor-pointer hover:text-blue-500">
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

          <CommunityRoadmapList />
        </div>
      </div>
    </div>
  );
}
