import { GetProfileOutput } from "@/types/api-profile";

type StatsProps = {
  data: GetProfileOutput["statistics"];
};

const Stats = ({ data }: StatsProps) => {
  return (
    <div className='flex flex-col'>
      <h3 className='text-mobile-heading-4-bold lg:text-heading-4-bold text-gray-800 mb-4'>
        Stats
      </h3>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4'>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {data.total_generated_roadmaps - data.total_finished_roadmaps}{" "}
            <span className='text-base text-gray-400'>/ 5</span>
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Generated Roadmaps
          </p>
        </div>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {data.total_in_progress_roadmaps}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Roadmaps In Progress
          </p>
        </div>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {data.total_finished_roadmaps}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Roadmaps Finished
          </p>
        </div>
        <div className='flex flex-col gap-2 p-4 md:p-6 w-full bg-white-500 border-2 border-blue-500 shadow-lg rounded-xl'>
          <p className='text-mobile-heading-1 lg:text-heading-1'>
            {data.total_bookmarked_roadmaps}
          </p>
          <p className='text-mobile-body-1-medium lg:text-body-1-medium'>
            Saved Roadmaps
          </p>
        </div>
      </div>
      {data.total_generated_roadmaps >= 5 && (
        <div className='bg-yellow-100 text-yellow-800 text-mobile-heading-4-regular lg:text-body-1-regular p-4 rounded-xl border border-yellow-300'>
          <p className='font-bold mb-1'>⚠️ Maximum Limit Reached</p>
          <span>
            You have reached the maximum limit of{" "}
            <span className='font-bold'>5</span> generated roadmaps. Either
            finish a roadmap or delete an existing one to continue.
          </span>
        </div>
      )}
    </div>
  );
};

export default Stats;
