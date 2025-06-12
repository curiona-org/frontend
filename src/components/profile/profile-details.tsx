"use client";
import YourRoadmap from "@/components/profile/my-roadmap";
import PersonalInformation from "@/components/profile/personal-information";
import Stats from "@/components/profile/stats";
import { GetProfileOutput } from "@/types/api-profile";

type ProfileDetailsProps = {
  profile: GetProfileOutput;
};

const ProfileDetails = ({ profile }: ProfileDetailsProps) => {
  return (
    <div className='min-h-screen px-6 lg:px-40 py-24 md:py-32'>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col gap-3 md:gap-6 p-8 rounded-2xl shadow-xl max-w-5xl w-full bg-white-500'>
          <PersonalInformation data={profile} />

          <div className='dashedLine'></div>

          <Stats data={profile.statistics} />

          <div className='dashedLine'></div>

          <YourRoadmap />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
