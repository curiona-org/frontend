"use client";
import PersonalizeRoadmap from "@/screens/personalization/personalize-roadmap";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PersonalizationPage() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const topicFromURL = searchParams.get("topic");
    if (topicFromURL) setTopic(topicFromURL);
  }, [searchParams]);

  if (!topic) return <p>Loading or invalid topic...</p>;

  return (
    <div className='min-h-screen flex items-center justify-center px-6 py-12 lg:px-64'>
      <PersonalizeRoadmap topic={topic} />
    </div>
  );
}
