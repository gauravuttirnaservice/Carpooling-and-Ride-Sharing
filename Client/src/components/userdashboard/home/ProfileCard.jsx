import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../../../utils/getImageUrl";

const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "User",
    firstName: "",
    lastName: "",
    phone: "Not provided",
    email: "email@example.com",
    gender: "Not specified",
    profilePicture: null
  });
  const [userId, setUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // High-res file object to upload
  const [previewPhoto, setPreviewPhoto] = useState(null); // Local preview OR remote URL

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/auth/user-details');
      if (response.data.success) {
        const userObj = response.data.user;
        const fullName = `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim() || "User";

        setUserId(userObj.id);
        const fetchedPhoto = getImageUrl(userObj.profilePicture, userObj.firstName);

        setProfileData({
          name: fullName,
          firstName: userObj.firstName || "",
          lastName: userObj.lastName || "",
          phone: userObj.phoneNumber || "Not provided",
          email: userObj.email || "email@example.com",
          gender: userObj.gender || "Not specified",
          profilePicture: fetchedPhoto,
          address: userObj.address || "Not provided"
        });

        console.log(userObj);
        setPreviewPhoto(fetchedPhoto);

        // Update local storage so other components (like Navbar) stay in sync
        localStorage.setItem("user", JSON.stringify(userObj));
        if (fetchedPhoto) {
          localStorage.setItem("userPhoto", fetchedPhoto);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // We split name into firstName and lastName for backend
    if (field === 'name') {
      const parts = value.split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      setProfileData(prev => ({ ...prev, name: value, firstName: fName, lastName: lName }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewPhoto(event.target.result);
      };
      reader.readAsDataURL(file);

      // Store actual file for submission
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('phoneNumber', profileData.phone === "Not provided" ? "" : profileData.phone);
      formData.append('gender', profileData.gender);
      formData.append('address', profileData.address);

      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const response = await axiosInstance.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success("Profile saved successfully!");
        setIsEditing(false);
        setSelectedFile(null); // clear staging

        // Refresh full data from server response
        const userObj = response.data.user;
        const newPhoto = getImageUrl(userObj.profilePicture, userObj.firstName);

        setProfileData(prev => ({
          ...prev,
          profilePicture: newPhoto
        }));
        setPreviewPhoto(newPhoto);

        // Update local storage
        localStorage.setItem("user", JSON.stringify(userObj));
        if (newPhoto) {
          localStorage.setItem("userPhoto", newPhoto);
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile updates.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset to last fetched state
    setPreviewPhoto(profileData.profilePicture);
    setSelectedFile(null);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm tracking-wide text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100 dark:border-slate-800">
      <div className="md:flex">
        {/* Left Sidebar */}
        <div className="md:w-1/3 bg-slate-900 dark:bg-slate-800 p-8 md:py-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div
            className={`relative z-10 group ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() =>
              isEditing && document.getElementById("photo-upload").click()
            }
          >
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={!isEditing}
            />
            <div className={`w-36 h-36 rounded-full flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-300 border-4 ${isEditing ? 'border-primary border-dashed ring-4 ring-primary/20 bg-primary/10 hover:scale-105' : 'border-slate-800 bg-slate-800'}`}>
              {previewPhoto ? (
                <img
                  id="profile-img-display"
                  src={previewPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-5xl font-black uppercase">
                  {profileData.name ? profileData.name.charAt(0) : "U"}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="absolute bottom-2 right-2 bg-primary text-slate-900 p-2.5 rounded-full shadow-lg hover:bg-white transition-colors border-2 border-slate-900">
                <span className="material-symbols-outlined text-sm font-bold block">
                  photo_camera
                </span>
              </div>
            )}
          </div>

          <div className="relative z-10 mt-6">
            <h2 className="text-white text-2xl font-extrabold tracking-tight mb-2">
              {profileData.name}
            </h2>
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Verified
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:w-2/3 p-8 md:p-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Personal Info</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your photo and details</p>
            </div>
            {isSubmitting && <span className="text-sm text-primary animate-pulse font-bold">Saving...</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8 mb-10">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Full Name
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex flex-shrink-0 items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </div>
                {!isEditing ? (
                  <p className="text-slate-900 dark:text-white font-bold text-base w-full truncate">
                    {profileData.name}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full rounded-xl px-4 py-2 bg-slate-50 border-2 border-slate-100 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Phone Number
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex flex-shrink-0 items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-lg">call</span>
                </div>
                {!isEditing ? (
                  <p className="text-slate-900 dark:text-white font-bold text-base w-full truncate">
                    {profileData.phone}
                  </p>
                ) : (
                  <input
                    type="text"
                    maxLength={10}
                    value={profileData.phone === "Not provided" ? "" : profileData.phone}
                    placeholder="Enter phone number"
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded-xl px-4 py-2 bg-slate-50 border-2 border-slate-100 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Email Address
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex flex-shrink-0 items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                {!isEditing ? (
                  <p className="text-slate-900 dark:text-white font-bold text-base w-full truncate">
                    {profileData.email}
                  </p>
                ) : (
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full rounded-xl px-4 py-2 bg-slate-100 border-2 border-slate-200 text-sm font-bold text-slate-500 cursor-not-allowed outline-none dark:bg-slate-800 dark:border-slate-700"
                    title="Email cannot be changed directly"
                  />
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Gender
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex flex-shrink-0 items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-lg">wc</span>
                </div>
                {!isEditing ? (
                  <p className="text-slate-900 dark:text-white font-bold text-base w-full">
                    {profileData.gender}
                  </p>
                ) : (
                  <select
                    value={profileData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="w-full rounded-xl px-4 py-2 bg-slate-50 border-2 border-slate-100 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:bg-slate-800/50 dark:border-slate-700 dark:text-white appearance-none"
                  >
                    <option value="Not specified">Not specified</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>
            </div>

            {/* Joined */}
            <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Addresss
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/50 flex flex-shrink-0 items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined text-lg"> location_on</span>
                </div>
                <p className="text-slate-900 dark:text-white font-bold text-base w-full">
                  {profileData.address}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 mt-6 border-t border-slate-50 dark:border-slate-800/80 flex flex-col sm:flex-row gap-3">
            <button
              onClick={toggleEdit}
              disabled={isSubmitting}
              className={`flex-1 sm:flex-none py-3.5 px-6 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${isEditing
                ? "bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                : "bg-primary text-slate-900 hover:bg-primary/90 shadow-primary/20"
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <span className="material-symbols-outlined text-[18px]">
                  {isEditing ? "check_circle" : "edit"}
                </span>
              )}
              <span>{isEditing ? (isSubmitting ? 'Saving...' : 'Save Changes') : 'Edit Profile'}</span>
            </button>

            {isEditing && (
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none py-3.5 px-6 rounded-xl border-2 border-slate-100 bg-white text-slate-600 hover:bg-slate-50 text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
