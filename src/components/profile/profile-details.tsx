"use client";
import React, { useEffect, useState } from "react";
import { ProfileService } from "@/lib/services/profile.service";
import { GetProfileOutput } from "@/types/api-profile";
import PersonalInformation from "@/components/profile/personal-information";
import Stats from "@/components/profile/stats";
import YourRoadmap from "@/components/profile/your-roadmap";
import { useAuth } from "@/providers/auth-provider";

const ProfileDetails = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const { setName, session } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const service = new ProfileService();
        const response = await service.profile();
        if (response && response.data) {
          const profileData: GetProfileOutput = response.data;
          setName(profileData.name);
          setNewName(profileData.name);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
        setName(updatedProfile.data.name);
      }
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center py-4">Profile data not found.</div>;
  }

  return (
    <div className="min-h-screen px-6 lg:px-40 py-32">
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-6 p-8 rounded-2xl shadow-xl max-w-5xl w-full">
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

          <div className="dashedLine"></div>

          <Stats generatedRoadmap={20} roadmapFinished={0} />

          <div className="dashedLine"></div>

          <YourRoadmap />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
