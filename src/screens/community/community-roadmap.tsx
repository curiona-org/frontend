"use client";
import SearchRoadmap from "@/components/roadmap/search-roadmap";
import CommunityRoadmapList from "@/components/roadmap/community-roadmap-list";

export default function CommunityRoadmap() {
  return (
    <div className="justify-center min-h-screen px-6 lg:px-40 py-32">
      <div className="flex flex-col gap-10">
        <SearchRoadmap />
      </div>
    </div>
  );
}
