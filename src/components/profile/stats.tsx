import React from "react";

interface StatsProps {
  generatedRoadmap: number;
  roadmapFinished: number;
}

const Stats: React.FC<StatsProps> = ({ generatedRoadmap, roadmapFinished }) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-mobile-heading-4-bold lg:text-heading-4-bold text-gray-800 mb-4">
        Stats
      </h3>

      <div className="flex gap-6">
        <div className="border rounded-lg p-6 w-32 text-center">
          <p className="text-mobile-heading-1 lg:text-heading-1">
            {generatedRoadmap}
          </p>
          <p className="text-mobile-body-1-medium lg:text-body-1-medium">
            Generated Roadmap
          </p>
        </div>
        <div className="border rounded-lg p-6 w-32 text-center">
          <p className="text-mobile-heading-1 lg:text-heading-1">
            {roadmapFinished}
          </p>
          <p className="text-mobile-body-1-medium lg:text-body-1-medium">
            Roadmap Finished
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
