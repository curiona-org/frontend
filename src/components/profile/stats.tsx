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
    <div className='flex flex-col'>
      <h3 className='text-mobile-heading-4-bold lg:text-heading-4-bold text-gray-800 mb-4'>
        Stats
      </h3>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6'>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {generatedRoadmap}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Generated Roadmaps
          </p>
        </div>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {onProgressRoadmap}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Roadmaps In Progress
          </p>
        </div>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {finishedRoadmap}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Roadmaps Finished
          </p>
        </div>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {savedRoadmap}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Saved Roadmaps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
