import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import UserNavbar from "../../components/userdashboard/layout/UserNavbar";
import RideHeader from "../../components/userdashboard/findRide/RideHeader";
import RideItinerary from "../../components/userdashboard/findRide/RideItinerary";
import DriverInfo from "../../components/userdashboard/findRide/DriverInfo";
import BookingCard from "../../components/userdashboard/findRide/BookingCard";

const RideDetailsPage = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await axiosInstance.get(`/rides/${id}`);
        console.log(response.data.data, "Response Ride");
        if (response.data.success) {
          setRide(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch ride", err);
        setError("Failed to load ride details or ride doesn't exist.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRide();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center font-display">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center font-display flex-col p-6">
        <div className="w-24 h-24 bg-white dark:bg-[#15241b] rounded-[1.5rem] shadow-xl flex items-center justify-center mb-6 border border-slate-100 dark:border-white/5 relative">
          <span className="material-symbols-outlined text-[3rem] text-red-500">error</span>
          <div className="absolute -inset-2 rounded-[2rem] border-[2px] border-red-500/20 pointer-events-none animate-pulse"></div>
        </div>
        <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white">Oops! Ride Missing.</h2>
        <p className="text-slate-500 font-medium max-w-sm text-center tracking-wide">{error || "This ride couldn't be loaded or no longer exists."}</p>
        <Link to="/find-ride" className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5 active:scale-95">
          Go back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-display antialiased min-h-screen flex flex-col transition-colors">
      <UserNavbar />

      <main className="flex-grow w-full px-4 sm:px-6 md:px-12 lg:px-40 py-8 max-w-[1440px] mx-auto z-10 relative">
        {/* Subtle background glow effect over the container */}
        <div className="absolute top-0 right-[20%] w-[30vw] h-[30vw] min-w-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        {/* Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-2.5 mb-8 text-[13px] font-bold tracking-wide uppercase text-slate-400 relative z-10">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/">
            <span className="material-symbols-outlined !text-[16px]">home</span>
            Home
          </Link>
          <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
          <Link className="hover:text-primary transition-colors" to="/find-ride">
            Search Results
          </Link>
          <span className="material-symbols-outlined !text-[14px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white px-2 py-1 bg-white dark:bg-white/10 rounded-md shadow-sm border border-slate-200 dark:border-transparent">
            Ride Details
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Main Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            <RideHeader ride={ride} />
            <RideItinerary ride={ride} />
            <DriverInfo ride={ride} />
          </div>

          {/* Sidebar / Booking Column */}
          <div className="lg:col-span-4 relative">
            {/* Using sticky container directly in BookingCard, so this wrapper just needs relative */}
            <BookingCard ride={ride} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RideDetailsPage;
