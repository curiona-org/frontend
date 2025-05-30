"use client";
import { useState } from "react";
import { Progress } from "radix-ui";
import RoadmapChart from "@/components/roadmap/roadmap-chart";
import { RoadmapService } from "@/lib/services/roadmap.service";
import ChatbotWidget from "@/components/chatbot/chatbot";
import RegenerateDialog from "@/components/roadmap/regenerate-dialog";
import DeleteDialog from "@/components/roadmap/delete-dialog";

const roadmapService = new RoadmapService();

export default function RoadmapDetailClient({ initialRoadmap, slug }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [saved, setSaved] = useState(roadmap.is_bookmarked);
  const [loading, setLoading] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      if (saved) {
        await roadmapService.unbookmarkRoadmap(roadmap.slug);
        setSaved(false);
        console.log(roadmap.is_bookmarked);
      } else {
        await roadmapService.bookmarkRoadmap(roadmap.slug);
        setSaved(true);
        console.log(roadmap.is_bookmarked);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = (updatedSlug: string, isFinished: boolean) => {
    if (!roadmap) return;

    const updatedTopics = roadmap.topics.map((topic) => {
      if (topic.slug === updatedSlug) {
        return { ...topic, is_finished: isFinished };
      }
      if (topic.subtopics) {
        const updatedSubtopics = topic.subtopics.map((sub) =>
          sub.slug === updatedSlug ? { ...sub, is_finished: isFinished } : sub
        );
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
      progression: {
        ...roadmap.progression,
        finished_topics: finishedCount,
      },
    });
  };

  const finishedTopics = roadmap?.progression?.finished_topics || 0;
  const totalTopics = roadmap.total_topics || 0;

  return (
    <>
      <div className="px-6 lg:px-40 pt-32">
        <div className="flex flex-col gap-6 border-2 border-blue-500 rounded-lg p-6">
          <div className="flex justify-between">
            <h1 className="text-mobile-display-2 lg:text-heading-1-bold">
              {roadmap.title}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={toggleSave}
                disabled={loading}
                className={`${
                  saved
                    ? "bg-blue-500 text-white-500"
                    : "text-gray-400 hover:text-blue-500"
                } transition-all ease-out duration-300 rounded-lg`}
                aria-label={saved ? "Unsave roadmap" : "Save roadmap"}
              >
                <div
                  className={`flex items-center gap-1 border ${
                    saved
                      ? "border-blue-500"
                      : "border-[#E5E5E5] hover:border-blue-500"
                  } rounded-lg p-2`}
                >
                  <span role="img" aria-label="folder">
                    🗂️
                  </span>
                  <span
                    className={`${saved ? "text-white-500" : "text-black-500"}`}
                  >
                    {saved ? "Saved!" : "Save"}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setRegenerateDialogOpen(true)}
                aria-label="Regenerate roadmap"
                className="hover:text-white-500"
              >
                <div className="flex items-center gap-1 border border-[#E5E5E5] hover:bg-blue-500 hover:border-blue-700 rounded-lg p-2">
                  <span role="img" aria-label="refresh">
                    🔄
                  </span>
                  <span>Regenerate</span>
                </div>
              </button>

              <button
                onClick={() => setDeleteDialogOpen(true)}
                aria-label="Delete roadmap"
                className="text-gray-400 hover:text-blue-500 transition-all ease-out duration-300 rounded-lg"
              >
                <div className="flex items-center gap-1 border bg-red-50 border-red-400 hover:bg-red-500 hover:border-red-700 rounded-lg p-2">
                  <span role="img" aria-label="refresh">
                    🗑️
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="relative my-2 dashedLine inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>

          <p className="text-mobile-body-1-regular lg:text-body-1-regular">
            {roadmap.description}
          </p>

          <div className="relative my-2 dashedLine inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between text-mobile-body-1-regular lg:text-body-1-regular flex-wrap gap-3">
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
              <span>{`${finishedTopics}/${totalTopics} Topics Completed`}</span>
            </div>
            <Progress.Root
              className="relative bg-blue-100 rounded-full h-3 overflow-hidden"
              value={finishedTopics}
              max={totalTopics}
            >
              <Progress.Indicator
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{
                  width: `${(finishedTopics / totalTopics) * 100}%`,
                }}
              />
            </Progress.Root>
          </div>
        </div>
      </div>
      <RoadmapChart roadmap={roadmap} updateTopicStatus={updateTopicStatus} />

      <ChatbotWidget slug={slug} />

      <RegenerateDialog
        slug={slug}
        open={regenerateDialogOpen}
        onClose={() => setRegenerateDialogOpen(false)}
      />

      <DeleteDialog
        slug={slug}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
