"use client";
import Loader from "@/components/loader/loader";
import YourRoadmap from "@/components/profile/my-roadmap";
import PersonalInformation from "@/components/profile/personal-information";
import Stats from "@/components/profile/stats";
import { ProfileService } from "@/lib/services/profile.service";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { useAuth } from "@/providers/auth-provider";
import { GetProfileOutput } from "@/types/api-profile";
import { useEffect, useState } from "react";

const profileService = new ProfileService();
const roadmapService = new RoadmapService();

const ProfileDetails = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const { updateProfile, session } = useAuth();
  const [generatedRoadmap, setGeneratedRoadmap] = useState<number>(0);
  const [onProgressRoadmap, setOnProgressRoadmap] = useState<number>(0);
  const [roadmapFinished, setRoadmapFinished] = useState<number>(0);
  const [savedRoadmap, setSavedRoadmapRoadmap] = useState<number>(0);

  useEffect(() => {
    const fetchProfileAndRoadmaps = async () => {
      try {
        const profileResponse = await profileService.profile();
        if (profileResponse && profileResponse.data) {
          const profileData: GetProfileOutput = profileResponse.data;
          await updateProfile(profileData.name);
          setNewName(profileData.name);
        }

        const roadmapResponse = await roadmapService.listUserRoadmap();
        const onProgressRoadmapResponse =
          await roadmapService.listUserOnProgressRoadmap();
        const finishedRoadmapResponse =
          await roadmapService.listUserFinishedRoadmap();
        const savedRoadmapResponse =
          await roadmapService.listBookmarkedRoadmaps();
        if (
          roadmapResponse &&
          roadmapResponse.data &&
          Array.isArray(roadmapResponse.data.items)
        ) {
          const roadmaps = roadmapResponse.data;
          const onProgress = onProgressRoadmapResponse.data;
          const finished = finishedRoadmapResponse.data;
          const saved = savedRoadmapResponse.data;

          setGeneratedRoadmap(roadmaps.total);
          setOnProgressRoadmap(onProgress.total);
          setRoadmapFinished(finished.total);
          setSavedRoadmapRoadmap(saved.total);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRoadmaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setNewName(session?.user.name || "");
  };

  const handleSaveClick = async () => {
    if (!newName || newName === session?.user.name) {
      setEditing(false);
      return;
    }
    try {
      const service = new ProfileService();
      await service.updateProfile(newName);

      const updatedProfile = await service.profile();
      if (updatedProfile && updatedProfile.data) {
        await updateProfile(updatedProfile.data.name);
      }
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (loading) {
    <Loader />;
  }

  if (!session) {
    return <div className='text-center py-4'>Profile data not found.</div>;
  }

  return (
    <div className='min-h-screen px-6 lg:px-40 py-24 md:py-32'>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col gap-3 md:gap-6 p-8 rounded-2xl shadow-xl max-w-5xl w-full bg-white-500'>
          <PersonalInformation
            name={session?.user.name}
            email={session?.user.email}
            joinedAt={session?.user.joined_at}
            avatar={session?.user.avatar}
            editing={editing}
            newName={newName}
            setNewName={setNewName}
            onEditClick={handleEditClick}
            onSaveClick={handleSaveClick}
            onCancelClick={handleCancelClick}
          />

          <div className='dashedLine'></div>

          <Stats
            generatedRoadmap={generatedRoadmap}
            onProgressRoadmap={onProgressRoadmap}
            finishedRoadmap={roadmapFinished}
            savedRoadmap={savedRoadmap}
          />

          <div className='dashedLine'></div>

          <YourRoadmap />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
