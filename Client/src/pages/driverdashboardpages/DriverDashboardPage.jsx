import { useState, useEffect } from "react";
import DriverNavbar from "../../components/driverdashboard/layout/DriverNavbar";
import ProfileCard from "../../components/driverdashboard/home/ProfileCard";
import StatsCard from "../../components/driverdashboard/home/StatsCard";

const DriverDashboardPage = () => {
  const [profileData, setProfileData] = useState({
    name: "Omkar Gawali",
    phone: "+91 8565258565",
    email: "omkar12@gmal.com",
    gender: "Male",
    dateOfBirth: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("driverProfile"));
    const savedPhoto = localStorage.getItem("driverPhoto");

    if (savedProfile) {
      setProfileData(savedProfile);
    }
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  // Handle profile save from ProfileCard component
  const handleProfileSave = (updatedProfile) => {
    setProfileData(updatedProfile);
  };

  // Handle photo change from ProfileCard component
  const handlePhotoChange = (base64Image) => {
    setProfilePhoto(base64Image);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50">
      <DriverNavbar />

      <main className="max-w-3xl mx-auto px-6 py-12 mt-16">
        {/* Page Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Driver Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            Manage your professional driver identity and performance
          </p>
        </div>

        {/* Profile Card Component */}
        <ProfileCard
          profileData={profileData}
          onSave={handleProfileSave}
          profilePhoto={profilePhoto}
          onPhotoChange={handlePhotoChange}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            label="Total Rides"
            value="124"
            subtext="+12% this month"
            icon="local_taxi"
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
            borderHoverColor="border-primary"
          />
          <StatsCard
            label="Driver Rating"
            value="4.9"
            icon="stars"
            iconBgColor="bg-yellow-400/10"
            iconColor="text-yellow-500"
            borderHoverColor="border-yellow-400"
          />
        </div>
      </main>
    </div>
  );
};

export default DriverDashboardPage;
