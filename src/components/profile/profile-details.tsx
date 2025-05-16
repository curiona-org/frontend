"use client";
import React, { useEffect, useState } from "react";
import { ProfileService } from "@/lib/services/profile.service";
import { GetProfileOutput } from "@/types/api-profile";
import UserRoadmapList from "@/components/roadmap/user-roadmap-list"; // Import komponen Roadmap List

const ProfileDetails = () => {
  const [profile, setProfile] = useState<GetProfileOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false); // Untuk toggle mode edit
  const [newName, setNewName] = useState<string>(""); // Menyimpan nama baru untuk update

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const service = new ProfileService();
        const response = await service.profile(); // Mengambil data dari API
        if (response && response.data) {
          setProfile(response.data); // Menetapkan data profil yang benar
          setNewName(response.data.name); // Set default name to be the current name
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async () => {
    if (!newName || newName === profile?.name) return; // Tidak mengubah jika nama sama
    try {
      const service = new ProfileService();
      await service.updateProfile(newName); // Memperbarui nama via API

      // Memuat ulang data profil setelah update untuk mendapatkan data terbaru
      const updatedProfile = await service.profile(); // Mengambil profil terbaru setelah perubahan
      setProfile(updatedProfile.data); // Menyimpan profil yang diperbarui
      setEditing(false); // Menutup mode edit
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center py-4">Profile data not found.</div>;
  }

  return (
    <div className="min-h-screen px-6 lg:px-40 py-32">
      <div className="flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-5xl w-full">
          {/* Profile Header */}
          <div className="flex items-center mb-8 border-b pb-6">
            {/* Avatar */}
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 rounded-full object-cover mr-6 border-4 border-blue-500"
            />
            {/* Profile Info */}
            <div className="flex-grow">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                {editing ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-3xl font-semibold text-gray-800 border-b-2 border-blue-500 outline-none"
                  />
                ) : (
                  profile.name
                )}
              </h2>
              <p className="text-lg text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Joined on {new Date(profile.joined_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-2xl text-gray-700 font-semibold">
              Personal Details
            </p>
            <div className="space-x-2">
              {editing ? (
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 text-white-500 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Display profile details */}
          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
            <div>
              <strong>Name:</strong> {profile.name}
            </div>
            <div>
              <strong>Email:</strong> {profile.email}
            </div>
            <div>
              <strong>Joined On:</strong>{" "}
              {new Date(profile.joined_at).toLocaleDateString()}
            </div>
          </div>

          {/* Display the User Roadmap List */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              My Roadmaps
            </h3>
            <UserRoadmapList /> {/* Add the UserRoadmapList component here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
