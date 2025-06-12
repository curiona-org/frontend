import {
  bookmarkRoadmap,
  unbookmarkRoadmap,
} from "@/app/roadmap/[slug]/actions";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { RoadmapSummary } from "@/types/api-roadmap";
import Link from "next/link";
import { Progress } from "radix-ui";
import { useState } from "react";
import RotatingLoader from "../loader/rotating-loader";

interface RoadmapCardProps {
  roadmap: RoadmapSummary;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  const { isLoggedIn } = useAuth();

  // Format skill level capitalization
  const skillLevel =
    roadmap.personalization_options.skill_level.charAt(0).toUpperCase() +
    roadmap.personalization_options.skill_level.slice(1).toLowerCase();

  // Progress values
  const finishedTopics = roadmap.progression.finished_topics || 0;
  const totalTopics =
    roadmap.progression.total_topics || roadmap.total_topics || 0;
  const completionPercent =
    totalTopics > 0 ? (finishedTopics / totalTopics) * 100 : 0;

  return (
    <Link href={`/roadmap/${roadmap.slug}`}>
      <div className="flex flex-col gap-2 group relative bg-white-500 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-transparent hover:ring hover:ring-blue-500 hover:cursor-pointer transition-all ease-out duration-300">
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <h3 className="text-mobile-heading-4-bold lg:text-heading-4-bold font-semibold truncate text-wrap">
              {roadmap.title.length > 50
                ? roadmap.title.slice(0, 50) + "..."
                : roadmap.title}
            </h3>
          </div>
          {isLoggedIn && (
            <SaveButton slug={roadmap.slug} isSaved={roadmap.is_bookmarked} />
          )}
        </div>

        {/* Divider */}
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Description */}
        <p className="text-mobile-body-1-regular lg:text-body-1-regular">
          {roadmap.description.length > 80
            ? roadmap.description.slice(0, 80) + "..."
            : roadmap.description}
        </p>

        {/* Divider */}
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Topics */}
        <div className="flex items-center justify-between text-mobile-body-1-regular lg:text-body-1-regular">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="lightbulb">
              💡
            </span>
            <span>Total Topics</span>
          </div>
          <span>{totalTopics}</span>
        </div>

        {/* Divider */}
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Skill Level */}
        <div className="flex items-center justify-between text-mobile-body-1-regular lg:text-body-1-regular">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="bicep">
              💪
            </span>
            <span>Skill Level</span>
          </div>
          <span>{skillLevel}</span>
        </div>

        {/* Divider */}
        {isLoggedIn && (
          <>
            <div className="relative my-4 h-[1px]">
              <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
              <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap justify-between text-mobile-body-1-regular lg:text-body-1-regular">
                <span className="hidden md:block">🏃 Learning Progress</span>
                <span>{`${finishedTopics}/${totalTopics} Topics Completed`}</span>
              </div>
              <Progress.Root
                className="relative bg-blue-100 rounded-full h-3 overflow-hidden"
                value={finishedTopics}
                max={totalTopics}
              >
                <Progress.Indicator
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${completionPercent}%` }}
                />
              </Progress.Root>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

const SaveButton = ({ slug, isSaved }: { slug: string; isSaved: boolean }) => {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      if (saved) {
        await unbookmarkRoadmap(slug);
        setSaved(false);
      } else {
        await bookmarkRoadmap(slug);
        setSaved(true);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0">
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
          className={`flex w-24 h-10 justify-center items-center gap-1 border ${
            saved ? "border-blue-500" : "border-[#E5E5E5] hover:border-blue-500"
          } rounded-lg p-2`}
        >
          {loading && (
            <RotatingLoader
              className={cn(
                "size-4 border-[3px]",
                saved ? "border-white-500" : "border-blue-500"
              )}
            />
          )}
          {!loading && (
            <>
              <span role="img" aria-label="folder">
                🗂️
              </span>
              <span
                className={`${saved ? "text-white-500" : "text-black-500"}`}
              >
                {saved ? "Saved!" : "Save"}
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default RoadmapCard;
