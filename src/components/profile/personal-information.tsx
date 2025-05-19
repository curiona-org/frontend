import React from "react";

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
  return (
    <div className="flex items-center justify-between border-b border-gray-200">
      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
      />

      {/* Info Section */}
      <div className="flex-grow mx-8">
        <p className="text-mobile-heading-4-bold lg:text-heading-4-bold font-semibold text-gray-800 mb-5">
          Personal Information
        </p>

        <div className="grid grid-cols-3 gap-x-12">
          <div>
            <p className="flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2">
              <span role="img" aria-label="user" className="mr-2">
                🙂
              </span>
              Full Name
            </p>
            <p className="text-mobile-body-1-regular lg:text-body-1-regular">
              {editing ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border-b-2 border-blue-600 focus:outline-none bg-blue-50"
                    autoFocus
                  />
                </>
              ) : (
                name
              )}
            </p>
          </div>

          <div>
            <p className="flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2">
              <span role="img" aria-label="email" className="mr-2">
                📬
              </span>
              Email
            </p>
            <p className="text-mobile-body-1-regular lg:text-body-1-regular">
              {email}
            </p>
          </div>

          <div>
            <p className="flex text-mobile-body-1-medium lg:text-body-1-medium text-black-200 items-center mb-2">
              <span role="img" aria-label="calendar" className="mr-2">
                🏠
              </span>
              Joined On
            </p>
            <p className="text-mobile-body-1-regular lg:text-body-1-regular">
              {new Date(joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-48 flex items-center justify-end gap-4">
        {editing ? (
          <>
            <button
              onClick={onSaveClick}
              className="flex items-center border-2 border-green-500 rounded-lg px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-green-100 transition"
            >
              💾 Save
            </button>
            <button
              onClick={onCancelClick}
              className="flex items-center border-2 border-red-500 rounded-lg px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-red-100 transition"
            >
              ❌ Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onEditClick}
            className="flex items-center border-2 border-[#E5E5E5] rounded-lg px-4 py-2 text-mobile-body-1-regular lg:text-body-1-regular hover:bg-gray-100 transition"
          >
            <span role="img" aria-label="pencil" className="mr-2">
              ✏️
            </span>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
