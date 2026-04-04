import { useState } from "react";
import DatePickerInput from "../../DatePicker/DatePicker";

const ProfileCard = ({ profileData, onSave, profilePhoto, onPhotoChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        // Call parent's photo change handler
        onPhotoChange(base64Image);
        localStorage.setItem("driverPhoto", base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Save changes
      onSave(editData);
      localStorage.setItem("driverProfile", JSON.stringify(editData));
    } else {
      // Enter edit mode
      setEditData({ ...profileData });
    }
    setIsEditing(!isEditing);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const firstName = profileData.name.split(" ")[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-8">
      <div className="md:flex">
        {/* Sidebar - Profile Photo Section */}
        <ProfileSidebar
          firstName={firstName}
          profilePhoto={profilePhoto}
          isEditing={isEditing}
          onPhotoChange={handlePhotoChange}
        />

        {/* Profile Fields Section */}
        <ProfileFields
          profileData={profileData}
          editData={editData}
          isEditing={isEditing}
          onInputChange={handleInputChange}
          onToggleEdit={toggleEditMode}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

// Sidebar Component
const ProfileSidebar = ({
  firstName,
  profilePhoto,
  isEditing,
  onPhotoChange,
}) => {
  return (
    <div className="md:w-1/3 bg-slate-900 dark:bg-slate-800 p-8 flex flex-col items-center justify-center text-center">
      <div className="relative group" id="photo-container">
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          accept="image/*"
          onChange={onPhotoChange}
        />
        <div className="w-24 h-24 bg-primary rounded-[1.5rem] rotate-3 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/30 transition-transform group-hover:rotate-0 duration-300">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover -rotate-3 group-hover:rotate-0 transition-transform"
            />
          ) : (
            <span className="material-symbols-outlined text-5xl text-slate-900 -rotate-3 group-hover:rotate-0 transition-transform font-bold">
              person
            </span>
          )}
        </div>
        {isEditing && (
          <div
            id="photo-edit-badge"
            className="absolute -top-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900 transition-transform cursor-pointer"
            onClick={() => document.getElementById("photo-upload").click()}
          >
            <span className="material-symbols-outlined text-sm font-bold">
              add_a_photo
            </span>
          </div>
        )}
      </div>
      <h2 className="text-white text-lg font-extrabold mt-6 tracking-tight">
        {firstName}
      </h2>
      <div className="mt-2 bg-primary/10 px-3 py-0.5 rounded-full border border-primary/20">
        <p className="text-primary text-[9px] font-bold uppercase tracking-[0.2em]">
          Verified Driver
        </p>
      </div>
    </div>
  );
};

// Profile Fields Component
const ProfileFields = ({
  profileData,
  editData,
  isEditing,
  onInputChange,
  onToggleEdit,
  onCancel,
}) => {
  return (
    <div className="md:w-2/3 p-8 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        {/* Full Name Field */}
        <ProfileField
          label="Full Name"
          icon="badge"
          value={profileData.name}
          editValue={editData.name}
          isEditing={isEditing}
          onChange={(value) => onInputChange("name", value)}
          type="text"
        />

        {/* Phone Field */}
        <ProfileField
          label="Phone"
          icon="call"
          value={profileData.phone}
          editValue={editData.phone}
          isEditing={isEditing}
          onChange={(value) => onInputChange("phone", value)}
          type="text"
        />

        {/* Email Field */}
        <div className="md:col-span-2 border-t border-slate-50 dark:border-slate-800/50 pt-6">
          <ProfileField
            label="Email Address"
            icon="mail"
            value={profileData.email}
            editValue={editData.email}
            isEditing={isEditing}
            onChange={(value) => onInputChange("email", value)}
            type="email"
          />
        </div>

        {/* Gender Field */}
        <div className="border-t border-slate-50 dark:border-slate-800/50 pt-6">
          <GenderField
            value={profileData.gender}
            editValue={editData.gender}
            isEditing={isEditing}
            onChange={(value) => onInputChange("gender", value)}
          />
        </div>

        {/* Date of Birth Field */}
        <div className="border-t border-slate-50 dark:border-slate-800/50 pt-6">
          <ProfileField
            label="Date of Birth"
            icon="cake"
            value={profileData.dateOfBirth || "Not set"}
            editValue={editData.dateOfBirth || ""}
            isEditing={isEditing}
            onChange={(value) => onInputChange("dateOfBirth", value)}
            type="date"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons
        isEditing={isEditing}
        onToggleEdit={onToggleEdit}
        onCancel={onCancel}
      />
    </div>
  );
};

// Reusable Profile Field Component
const ProfileField = ({
  label,
  icon,
  value,
  editValue,
  isEditing,
  onChange,
  type = "text",
}) => {
  // Format date for display if type is date
  const displayValue =
    type === "date" && value && value !== "Not set"
      ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : value;

  return (
    <div className="space-y-0.5">
      <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg font-bold">
          {icon}
        </span>
        {!isEditing ? (
          <p className="text-slate-900 dark:text-white font-bold text-base">
            {displayValue}
          </p>
        ) : type === "date" ? (
          <DatePickerInput
            label=""
            value={editValue}
            onChange={(val) => onChange(val)}
            className="w-full rounded-lg border focus-within:ring-1 focus-within:ring-primary focus-within:border-primary border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all"
            slotProps={{
              textField: {
                placeholder: "Select Date",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0.5rem',
                    height: '2rem', // Matches py-1 approximately
                    backgroundColor: 'transparent'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-input': {
                    padding: '0.25rem 0.5rem', // px-2 py-1 equivalent
                    fontSize: '0.875rem', // text-sm
                    fontWeight: 700, // font-bold
                    color: 'inherit'
                  }
                }
              }
            }}
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg px-2 py-1 text-sm font-bold focus:ring-primary focus:border-primary border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        )}
      </div>
    </div>
  );
};

// Gender Field Component (uses select instead of input)
const GenderField = ({ value, editValue, isEditing, onChange }) => {
  return (
    <div className="space-y-0.5">
      <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Gender
      </label>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg font-bold">
          wc
        </span>
        {!isEditing ? (
          <p className="text-slate-900 dark:text-white font-bold text-base">
            {value}
          </p>
        ) : (
          <select
            value={editValue}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg px-2 py-1 text-sm font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        )}
      </div>
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ isEditing, onToggleEdit, onCancel }) => {
  return (
    <div className="pt-2 flex gap-3">
      <button
        onClick={onToggleEdit}
        className={`w-full md:w-auto px-8 py-3 rounded-xl font-black text-xs transition-all hover:opacity-80 active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${isEditing
          ? "bg-blue-500 text-white shadow-blue-500/20"
          : "bg-primary text-slate-900 shadow-primary/20"
          }`}
      >
        <span className="material-symbols-outlined text-lg font-black">
          {isEditing ? "check" : "edit"}
        </span>
        <span>{isEditing ? "Save Profile" : "Edit Profile"}</span>
      </button>
      {isEditing && (
        <button
          onClick={onCancel}
          className="w-full md:w-auto bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white px-8 py-3 rounded-xl font-black text-xs transition-all hover:opacity-80 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
