import React from "react";

interface StatsProps {
  generatedRoadmap: number;
  roadmapFinished: number;
}

const Stats: React.FC<StatsProps> = ({ generatedRoadmap, roadmapFinished }) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Stats</h3>

      <div className="flex gap-6">
        <div className="border rounded-lg p-6 w-32 text-center">
          <p className="text-3xl font-semibold">{generatedRoadmap}</p>
          <p>Generated Roadmap</p>
        </div>
        <div className="border rounded-lg p-6 w-32 text-center">
          <p className="text-3xl font-semibold">{roadmapFinished}</p>
          <p>Roadmap Finished</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
