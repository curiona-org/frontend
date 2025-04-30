import { useState } from "react";
import { RoadmapProps } from "@/components/roadmap/roadmap-list";
import Link from "next/link";

interface RoadmapCardProps {
  roadmap: RoadmapProps;
}

const RoadmapCard = ({ roadmap }: RoadmapCardProps) => {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    setSaved(!saved);
  };

  return (
    <Link href={`/roadmap/${roadmap.slug}`}>
      <div className="group relative bg-white-500 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-transparent hover:ring hover:ring-blue-500 hover:cursor-pointer transition-all ease-out duration-300">
        {/* Title */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 truncate text-wrap">
              {roadmap.title.length > 30
                ? roadmap.title.slice(0, 50) + "..."
                : roadmap.title}
            </h3>
          </div>
          <div className="shrink-0">
            <button
              onClick={handleClick}
              className={`${
                saved
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:text-blue-500"
              } transition-all ease-out duration-300 rounded-lg`}
            >
              <div
                className={`flex items-center gap-1 border ${
                  saved
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-blue-500"
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
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          {roadmap.description.length > 60
            ? roadmap.description.slice(0, 80) + "..."
            : roadmap.description}
        </p>

        {/* Divider */}
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Topics */}
        <div className="flex items-center justify-between text-sm text-gray-700 my-2">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="lightbulb">
              💡
            </span>
            <span>Total Topics</span>
          </div>
          <span>{roadmap.total_topics}</span>
        </div>

        {/* Divider */}
        <div className="relative my-4 h-[1px]">
          <div className="dashedLine absolute inset-0 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="solidLine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Skill Level */}
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <span role="img" aria-label="bicep">
              💪
            </span>
            <span>Skill Level</span>
          </div>
          <span>
            {roadmap.personalization_options.skill_level
              .charAt(0)
              .toUpperCase() +
              roadmap.personalization_options.skill_level
                .slice(1)
                .toLowerCase()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RoadmapCard;
