"use client";
import { useState } from "react";
import { Progress } from "radix-ui";
import RoadmapChart from "@/components/roadmap/roadmap-chart";

export default function RoadmapDetailClient({ initialRoadmap, slug }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);

  const updateTopicStatus = (updatedSlug: string, isFinished: boolean) => {
    if (!roadmap) return;
    const updatedTopics = roadmap.topics.map((topic) => {
      if (topic.slug === updatedSlug) {
        return { ...topic, is_finished: isFinished };
      }
      // Jika ada subtopics, cek juga
      if (topic.subtopics) {
        const updatedSubtopics = topic.subtopics.map((sub) => {
          if (sub.slug === updatedSlug) {
            return { ...sub, is_finished: isFinished };
          }
          return sub;
        });
        return { ...topic, subtopics: updatedSubtopics };
      }
      return topic;
    });

    const finishedCount = updatedTopics.reduce((count, topic) => {
      let c = topic.is_finished ? 1 : 0;
      if (topic.subtopics) {
        c += topic.subtopics.filter((sub) => sub.is_finished).length;
      }
      return count + c;
    }, 0);

    setRoadmap({
      ...roadmap,
      topics: updatedTopics,
      finished_topics: finishedCount,
    });
  };

  return (
    <>
      <div className="px-6 lg:px-40 pt-32">
        <div className="flex flex-col gap-6 border-2 border-blue-500 rounded-lg p-6">
          <h1 className="text-mobile-display-2 lg:text-heading-1-bold">
            {roadmap.title}
          </h1>
          <div className="relative my-2 dashedLine inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <p className="text-mobile-body-1-regular lg:text-body-1-regular">
            {roadmap.description}
          </p>
          <div className="relative my-2 dashedLine inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between text-mobile-body-1-regular lg:text-body-1-regular">
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
              <span>
                📆 Duration :{" "}
                {roadmap.personalization_options.total_duration.value}{" "}
                {roadmap.personalization_options.total_duration.unit}
              </span>
            </div>
          </div>
          <div className="relative my-2 dashedLine inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-mobile-body-1-regular lg:text-body-1-regular">
              <span>🏃 Progress Learning</span>
              <span>{`${roadmap.finished_topics || 0}/${
                roadmap.total_topics
              } Topics Completed`}</span>
            </div>
            <Progress.Root
              className="relative bg-blue-100  rounded-full h-3 overflow-hidden"
              value={roadmap.finished_topics || 0}
              max={roadmap.total_topics}
            >
              <Progress.Indicator
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{
                  width: `${
                    ((roadmap.finished_topics || 0) / roadmap.total_topics) *
                    100
                  }%`,
                }}
              />
            </Progress.Root>
          </div>
        </div>
      </div>
      <RoadmapChart roadmap={roadmap} updateTopicStatus={updateTopicStatus} />
    </>
  );
}
