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

      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4'>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {generatedRoadmap - finishedRoadmap}{" "}
            <span className='text-base text-gray-400'>/ 5</span>
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
      {generatedRoadmap >= 5 && (
        <div className='bg-yellow-100 text-yellow-800 text-mobile-heading-4-regular lg:text-body-1-regular p-4 rounded-xl border border-yellow-300'>
          <p className='font-bold mb-1'>⚠️ Maximum Limit Reached</p>
          <p>
            You have reached the maximum limit of 5 generated roadmaps. Either
            finish a roadmap or delete an existing one to continue.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;
