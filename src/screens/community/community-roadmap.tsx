"use client";
import SearchRoadmap from "@/components/roadmap/search-roadmap";
import CommunityRoadmapList from "@/components/roadmap/community-roadmap";

export default function CommunityRoadmap() {
  return (
    <div className="justify-center min-h-screen px-6 lg:px-40 py-32">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center font-satoshi text-display-1">
            <h1>Explore Community</h1>
            <span className="text-blue-500 dashedBorder px-5 py-1">
              Roadmaps
            </span>
          </div>
          <p className="font-satoshi text-heading-4-regular">
            Find inspiration in community-made roadmaps and start your own
            journey.
          </p>
          <SearchRoadmap />
        </div>

        <div className="flex flex-col">
          <CommunityRoadmapList />
        </div>
      </div>
    </div>
  );
}
