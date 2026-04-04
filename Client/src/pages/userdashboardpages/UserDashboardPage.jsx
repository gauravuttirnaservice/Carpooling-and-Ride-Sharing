import React from "react";
import ProfileCard from "../../components/userdashboard/home/ProfileCard";
import UserNavbar from "../../components/userdashboard/layout/UserNavbar";

const UserDashboard = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 min-h-screen">
      <UserNavbar />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            User Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            Manage your carpooling profile information
          </p>
        </div>

        <ProfileCard />
      </main>
    </div>
  );
};

export default UserDashboard;
