import React from "react";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { notFound } from "next/navigation";
import RoadmapChart from "@/components/roadmap/roadmap-chart";

const roadmapService = new RoadmapService();

interface RoadmapDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  let roadmap;

  try {
    const result = await roadmapService.getRoadmapBySlug(slug);

    if (result?.data) {
      roadmap = result.data;
    } else {
      notFound();
    }

    console.log(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap:", error);
    notFound();
  }

  return (
    <div className="min-h-screen px-6 lg:px-40 py-32">
      <div className="flex flex-col gap-6 border-2 border-blue-500 rounded-lg p-6">
        <h1 className="text-mobile-display-1 lg:text-display-1">
          {roadmap.title}
        </h1>
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
        </div>
        <p className="text-mobile-heading-4-regular lg:text-heading-4-regular">
          {roadmap.description}
        </p>
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <span>
              📅 Date Created :{" "}
              {new Date(roadmap.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span>
              ⌛ Time Available :{" "}
              {roadmap.personalization_options.daily_time_availability.value}{" "}
              {roadmap.personalization_options.daily_time_availability.unit} /
              Per Day
            </span>
            <span>
              🤯 Skill Level : {roadmap.personalization_options.skill_level}
            </span>
          </div>
          <span>
            📆 Duration : {roadmap.personalization_options.total_duration.value}{" "}
            {roadmap.personalization_options.total_duration.unit}
          </span>
        </div>
      </div>

      {roadmap && <RoadmapChart roadmap={roadmap}></RoadmapChart>}
    </div>
  );
}
