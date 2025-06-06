import React, { useState } from "react";
import Button from "../ui/button";

interface PersonalInformationProps {
  name: string;
  email: string;
  joinedAt: Date;
  avatar: string;
  editing: boolean;
  newName: string;
  setNewName: (name: string) => void;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  name,
  email,
  joinedAt,
  avatar,
  editing,
  newName,
  setNewName,
  onEditClick,
  onSaveClick,
  onCancelClick,
}) => {
  const [editNameError, setEditNameError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.value.length > 40) {
      setEditNameError("Name cannot exceed 40 characters.");
    } else {
      setEditNameError("");
    }

    setNewName(e.target.value);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

    onSaveClick();
    setEditNameError(""); // Clear error on save
  };

  return (
    <div className='flex flex-wrap md:flex-nowrap gap-8 items-center justify-between'>
      <img
        src={avatar}
        alt={name}
        className='w-28 h-28 rounded-full object-cover border-4 border-blue-500'
      />

      <div className='w-full flex flex-col gap-4'>
        <p className='text-mobile-heading-4-bold lg:text-heading-4-bold font-semibold text-gray-800 mb-5'>
          Personal Information
        </p>

        <div className='flex flex-col md:grid md:grid-cols-4 md:gap-x-12'>
          <div className='col-span-2 flex justify-between items-center md:block'>
            <p className='flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2'>
              <span role='img' aria-label='user' className='mr-2'>
                🙂
              </span>
              Full Name
            </p>
            <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
              {editing ? (
                <>
                  <input
                    type='text'
                    value={newName}
                    onChange={handleNameChange}
                    className='w-full border-b-2 border-blue-600 focus:outline-none bg-blue-50'
                    autoFocus
                  />
                </>
              ) : (
                name
              )}
            </p>

            {editNameError && (
              <p className='text-red-500 text-mobile-body-1-regular lg:text-body-1-regular'>
                {editNameError}
              </p>
            )}
          </div>

          <div className='flex justify-between items-center md:block'>
            <p className='flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2'>
              <span role='img' aria-label='email' className='mr-2'>
                📬
              </span>
              Email
            </p>
            <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
              {email}
            </p>
          </div>

          <div className='flex justify-between items-center md:block'>
            <p className='flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2'>
              <span role='img' aria-label='calendar' className='mr-2'>
                🏠
              </span>
              Joined On
            </p>
            <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
              {new Date(joinedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='w-full md:w-fit flex gap-4'>
        {editing ? (
          <>
            <Button
              onClick={handleSaveClick}
              disabled={editNameError !== ""}
              className='flex md:flex-col w-full md:w-20 justify-center border-2 border-green-500 px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-green-100 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300'
            >
              <span role='img' aria-label='save'>
                💾
              </span>
              Save
            </Button>
            <Button
              onClick={onCancelClick}
              className='flex md:flex-col w-full md:w-20 justify-center border-2 border-red-500 px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-red-100'
            >
              <span role='img' aria-label='cancel'>
                ❌
              </span>
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={onEditClick}
            className='w-full md:w-32 py-3 border-2 border-[#E5E5E5] text-mobile-body-1-regular lg:text-body-1-regular hover:bg-gray-100'
          >
            <span role='img' aria-label='pencil'>
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
