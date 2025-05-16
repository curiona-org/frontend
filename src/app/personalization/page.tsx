"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PersonalizeRoadmap from "@/screens/personalization/personalize-roadmap";

export default function PersonalizationPage() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const topicFromURL = searchParams.get("topic");
    if (topicFromURL) setTopic(topicFromURL);
  }, [searchParams]);

  if (!topic) return <p>Loading or invalid topic...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 lg:px-40">
      <PersonalizeRoadmap topic={topic} />
    </div>
  );
}
