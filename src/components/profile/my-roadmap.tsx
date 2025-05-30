import React, { useState } from "react";
import UserRoadmapList from "@/components/roadmap/user-roadmap-list";

type FilterType = "all" | "onprogress" | "saved" | "finished";

const YourRoadmap = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Roadmaps</h3>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-8">
        <button
          onClick={() => setFilter("all")}
          className={`py-4 px-2 rounded-lg ${
            filter === "all"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          🗂️ All Roadmaps
        </button>
        <button
          onClick={() => setFilter("onprogress")}
          className={`py-4 px-2 rounded-lg ${
            filter === "onprogress"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          🏃 On Progress Roadmaps
        </button>
        <button
          onClick={() => setFilter("finished")}
          className={`py-4 px-2 rounded-lg ${
            filter === "finished"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 dashedBorder hover:bg-gray-100"
          }`}
        >
          🏁 Finished Roadmaps
        </button>
        <button
          onClick={() => setFilter("saved")}
          className={`py-4 px-2 rounded-lg ${
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
