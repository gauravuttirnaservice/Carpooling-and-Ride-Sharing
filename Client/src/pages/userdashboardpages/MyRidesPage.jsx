import React, { useState, useEffect } from "react";
import UserNavbar from "../../components/userdashboard/layout/UserNavbar";
import RideCard from "../../components/userdashboard/myRide/RideCard";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const MyRidesPage = () => {
  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreRides, setHasMoreRides] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMyBookings = async (targetPage = 1, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await axiosInstance.get(`/bookings/my-bookings?page=${targetPage}&limit=6`);
      if (response.data.success) {
        // Map backend booking object to the format expected by RideCard
        const mappedRides = response.data.data.map(booking => {
          // Determine status flags
          const isBookingCancelled = booking.status === 'cancelled';
          const isRideCancelled = booking.ride.status === 'cancelled';

          let displayStatus = booking.status; // Default 'confirmed' or 'cancelled'
          if (displayStatus === 'confirmed') {
            if (booking.ride.status === 'completed') displayStatus = 'completed';
            else if (booking.ride.status === 'ongoing') displayStatus = 'ongoing';
            else displayStatus = 'upcoming';
          }
          if (isRideCancelled) displayStatus = 'cancelled'; // Override if parent ride is cancelled

          // Format Date
          const depDate = new Date(booking.ride.departureTime);
          const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(depDate);

          return {
            id: booking.id, // We use the booking ID for cancellation/completion
            rideId: booking.rideId, // We use the actual ride ID for reviews
            status: displayStatus,
            price: booking.totalPrice,
            pickup: booking.ride.origin,
            dropoff: booking.ride.destination,
            time: formattedDate,
            driver: booking.ride.driver ? (booking.ride.driver.firstName === booking.ride.driver.lastName ? booking.ride.driver.firstName : `${booking.ride.driver.firstName} ${booking.ride.driver.lastName || ''}`.trim()) : "Driver",
            driverPhoneNumber: booking.ride.driver ? booking.ride.driver.phoneNumber : "",
            driverProfilePicture: booking.ride.driver?.profilePicture || null,
            cancellationMsg: isRideCancelled ? "Ride cancelled by driver" : (isBookingCancelled ? "Cancelled by you" : ""),
          };
        });
        setRides(prev => reset ? mappedRides : [...prev, ...mappedRides]);
        setHasMoreRides(targetPage < response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching my rides:", error);
      toast.error("Failed to load your rides");
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMyBookings(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMyBookings(nextPage, false);
  };

  const handleCancel = async (id) => {
    try {
      const response = await axiosInstance.put(`/bookings/${id}/cancel`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchMyBookings(1, true); // Refresh the list
      }
    } catch (error) {
      console.error("Error cancelling ride:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  // const handleComplete = async (id) => {
  //   try {
  //     const response = await axiosInstance.put(`/bookings/${id}/complete`);
  //     if (response.data.success) {
  //       toast.success(response.data.message);
  //       fetchMyBookings(1, true); // Refresh the list to show the rating UI
  //     }
  //   } catch (error) {
  //     console.error("Error completing ride:", error);
  //     toast.error(error.response?.data?.message || "Failed to mark ride as complete");
  //   }
  // };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-4">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            My Rides
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
            Manage your booked journeys, track upcoming trips, and review your travel history all in one place.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary text-slate-900 dark:text-white"></div>
          </div>
        ) : rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">directions_car</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">No bookings yet</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mb-8">
              Looks like you haven't booked any rides yet. Start your journey by finding a comfortable ride to your destination.
            </p>
            <a href="/find-ride" className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-slate-900 rounded-2xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-primary/20">
              Find a Ride Now
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} onCancel={handleCancel} />
              ))}
            </div>

            {hasMoreRides && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More Rides"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRidesPage;
