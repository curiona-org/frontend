import React, { useState } from "react";
import UserRoadmapList from "@/components/roadmap/user-roadmap-list";

type FilterType = "all" | "onprogress" | "saved" | "finished";

const YourRoadmap = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as FilterType);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-mobile-heading-4-bold lg:text-heading-4-bold">
        My Roadmaps
      </h3>

      <div className="md:hidden">
        <select
          value={filter}
          onChange={handleChange}
          className="w-full p-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">🗺️ All Roadmaps</option>
          <option value="onprogress">🏃 In Progress Roadmaps</option>
          <option value="finished">🏁 Finished Roadmaps</option>
          <option value="saved">📌 Saved Roadmaps</option>
        </select>
      </div>

      <div className="hidden md:grid grid-cols-4 gap-8">
        <button
          onClick={() => setFilter("all")}
          className={`py-4 px-2 rounded-lg text-mobile-body-1-medium lg:text-body-1-medium ${
            filter === "all"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          🗺️ All Roadmaps
        </button>
        <button
          onClick={() => setFilter("onprogress")}
          className={`py-4 px-2 rounded-lg text-mobile-body-1-medium lg:text-body-1-medium ${
            filter === "onprogress"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          🏃 In Progress Roadmaps
        </button>
        <button
          onClick={() => setFilter("finished")}
          className={`py-4 px-2 rounded-lg text-mobile-body-1-medium lg:text-body-1-medium ${
            filter === "finished"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          🏁 Finished Roadmaps
        </button>
        <button
          onClick={() => setFilter("saved")}
          className={`py-4 px-2 rounded-lg text-mobile-body-1-medium lg:text-body-1-medium ${
            filter === "saved"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          📌 Saved Roadmaps
        </button>
      </div>

      <UserRoadmapList filter={filter} />
    </div>
  );
};

export default YourRoadmap;
