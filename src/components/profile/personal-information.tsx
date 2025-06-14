import RotatingLoader from "@/components/loader/rotating-loader";
import Button from "@/components/ui/button";
import { toast } from "@/components/ui/toast-sonner";
import { useAuth } from "@/providers/auth-provider";
import { GetProfileOutput } from "@/types/api-profile";
import React, { useState } from "react";

interface PersonalInformationProps {
  data: GetProfileOutput;
}

const PersonalInformation = ({ data }: PersonalInformationProps) => {
  const { updateProfile, authError, authIsLoading } = useAuth();
  const [newName, setNewName] = useState<string>(data.name || "");
  const [editing, setEditing] = useState<boolean>(false);
  const [editNameError, setEditNameError] = useState("");

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setNewName(data.name || "");
    setEditNameError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value.length > 40) {
      setEditNameError("Name cannot exceed 40 characters.");
    } else {
      setEditNameError("");
    }

    setNewName(e.target.value);
  };

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newName.trim() === "") {
      setEditNameError("Name cannot be empty.");
      return;
    }

    if (newName.length > 40) {
      setEditNameError("Name cannot exceed 40 characters.");
      return;
    } else {
      setEditNameError("");
    }

    if (!newName || newName === data.name) {
      setEditing(false);
      return;
    }

    try {
      await updateProfile(newName);
      setEditing(false);
      toast({
        type: "success",
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        type: "error",
        title: "Error",
        description: authError || "Failed to update profile",
      });
    } finally {
      setEditNameError(""); // Clear error on save
    }
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 items-center justify-between">
      <img
        src={data.avatar}
        alt={data.name}
        className="size-28 select-none rounded-full object-cover border-4 border-blue-500"
      />
      <div className="w-full flex flex-col gap-4">
        <p className="text-mobile-heading-4-bold lg:text-heading-4-bold font-semibold text-gray-800">
          Personal Information
        </p>
        <div className="flex flex-col gap-2">
          <div className="md:grid md:grid-cols-3 md:gap-x-12 overflow-hidden">
            <div className="w-full flex justify-between items-center md:block px-1">
              <p className="flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2">
                <span
                  role="img"
                  aria-label="user"
                  className="mr-2 flex-shrink-0"
                >
                  🙂
                </span>
                Full Name
              </p>
              <p
                className="text-mobile-body-1-regular lg:text-body-1-regular break-words"
                title={editing ? undefined : newName}
              >
                {editing ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={handleNameChange}
                      className="w-full border-b-2 border-blue-600 focus:outline-none bg-blue-50"
                      autoFocus
                    />
                  </>
                ) : (
                  newName
                )}
              </p>
            </div>
            <div className="w-full flex justify-between items-center md:block px-1">
              <p className="flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2">
                <span
                  role="img"
                  aria-label="email"
                  className="mr-2 flex-shrink-0"
                >
                  📬
                </span>
                Email
              </p>
              <p
                className="text-mobile-body-1-regular lg:text-body-1-regular break-words"
                title={data.email}
              >
                {data.email}
              </p>
            </div>
            <div className="w-full flex justify-between items-center md:block px-1">
              <p className="flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2">
                <span
                  role="img"
                  aria-label="calendar"
                  className="mr-2 flex-shrink-0"
                >
                  🏠
                </span>
                Joined On
              </p>
              <p
                className="text-mobile-body-1-regular lg:text-body-1-regular break-words"
                title={new Date(data.joined_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              >
                {new Date(data.joined_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {editNameError && (
            <p className="text-red-500 text-mobile-body-1-regular lg:text-body-1-regular">
              {editNameError}
            </p>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className="w-full md:w-fit flex gap-4">
        {editing ? (
          <>
            <Button
              onClick={handleSaveClick}
              disabled={editNameError !== ""}
              className="flex md:flex-col w-full md:w-20 items-center justify-center border-2 border-green-500 px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-green-100 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300"
            >
              {!authIsLoading && (
                <>
                  <span role="img" aria-label="save">
                    💾
                  </span>
                  Save
                </>
              )}
              {authIsLoading && (
                <RotatingLoader className="size-6 border-[3px] border-green-500" />
              )}
            </Button>
            <Button
              onClick={handleCancelClick}
              className="flex md:flex-col w-full md:w-20 justify-center border-2 border-red-500 px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-red-100"
            >
              <span role="img" aria-label="cancel">
                ❌
              </span>
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={handleEditClick}
            className="w-full md:w-32 py-3 border-2 border-[#E5E5E5] text-mobile-body-1-regular lg:text-body-1-regular hover:bg-gray-100"
          >
            <span role="img" aria-label="pencil">
              ✏️
            </span>
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
