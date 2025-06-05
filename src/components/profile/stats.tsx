import React from "react";

interface StatsProps {
  generatedRoadmap: number;
  onProgressRoadmap: number;
  finishedRoadmap: number;
  savedRoadmap: number;
}

const Stats: React.FC<StatsProps> = ({
  generatedRoadmap,
  onProgressRoadmap,
  finishedRoadmap,
  savedRoadmap,
}) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-mobile-heading-4-bold lg:text-heading-4-bold text-gray-800 mb-4">
        Stats
      </h3>

      <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
        <div className="col-span-3 border rounded-lg p-6 w-full text-center bg-gray-100 border-gray-300">
          <p className="text-mobile-heading-1 lg:text-heading-1">
            {generatedRoadmap}
          </p>
          <p className="text-mobile-body-1-medium lg:text-body-1-medium">
            Generated Roadmap
          </p>
        </div>
        <div className="col-span-3 border rounded-lg p-6 w-full text-center bg-gray-100 border-gray-300">
          <p className="text-mobile-heading-1 lg:text-heading-1">
            {onProgressRoadmap}
          </p>
          <p className="text-mobile-body-1-medium lg:text-body-1-medium">
            In Progress Roadmap
          </p>
        </div>
        <div className="col-span-3 border rounded-lg p-6 w-full text-center bg-gray-100 border-gray-300">
          <p className="text-mobile-heading-1 lg:text-heading-1">
            {finishedRoadmap}
          </p>
          <p className="text-mobile-body-1-medium lg:text-body-1-medium">
            Roadmap Finished
          </p>
        </div>
        <div className="col-span-3 border rounded-lg p-6 w-full text-center bg-gray-100 border-gray-300">
          <p className="text-mobile-heading-1 lg:text-heading-1">
            {savedRoadmap}
          </p>
          <p className="text-mobile-body-1-medium lg:text-body-1-medium">
            Roadmap Saved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
