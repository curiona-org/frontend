import React, { useState } from "react";
import UserRoadmapList from "@/components/roadmap/user-roadmap-list";

type FilterType = "all" | "onprogress" | "saved";

const YourRoadmap = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">My Roadmaps</h3>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded border ${
            filter === "all"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          🗂️ All Roadmaps
        </button>
        <button
          onClick={() => setFilter("onprogress")}
          className={`px-4 py-2 rounded border ${
            filter === "onprogress"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          🏃 On Progress Roadmaps
        </button>
        <button
          onClick={() => setFilter("saved")}
          className={`px-4 py-2 rounded border ${
            filter === "saved"
              ? "bg-blue-500 text-white-500 border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
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
