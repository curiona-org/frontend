"use client";
import { useState } from "react";
import ButtonSignOut from "@/components/button-sign-out";
import { useAuth } from "@/providers/auth-provider";
import RoadmapList from "@/components/roadmap/user-roadmap-list";
import GenerateRoadmap from "@/components/roadmap/generate-roadmap";
import PersonalizeRoadmap from "@/screens/personalization/personalize-roadmap";

export default function HomeAuthenticated() {
  const { session } = useAuth();
  const [topic, setTopic] = useState("");

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
          <GenerateRoadmap onTopicChange={setTopic} />
        </div>

        {topic && (
          <div className="flex flex-col">
            <PersonalizeRoadmap topic={topic} />
          </div>
        )}

        {/* Tetap tampilkan RoadmapList dan SignOut button */}
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
  );
}
