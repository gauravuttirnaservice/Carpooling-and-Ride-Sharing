import DriverNavbar from "../../components/driverdashboard/layout/DriverNavbar";
import RideCard from "../../components/driverdashboard/myRides/RideCard";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const ScheduleRidesPage = () => {
  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMyRides = async (targetPage = 1, reset = false) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await axiosInstance.get(`/rides/my-rides?page=${targetPage}&limit=6`);
      if (response.data.success) {
        const formattedRides = response.data.data.map(ride => ({
          id: ride.id,
          status: ride.status === 'scheduled' ? 'upcoming' : ride.status,
          date: new Date(ride.departureTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          fare: ride.pricePerSeat,
          from: ride.origin,
          to: ride.destination,
          totalSeats: ride.availableSeats,
          bookedSeats: ride.bookedSeats || 0,
          emptySeats: ride.availableSeats - (ride.bookedSeats || 0),

          passengers: `${ride.bookedSeats}`,
          profilePic: ride.profilePicture,
          passengerList: ride.passengerDetails || [],
          driverVerified: ride.driverVerified,
          rating: ride.rating || 0
        }));
        setRides(prev => reset ? formattedRides : [...prev, ...formattedRides]);
        setHasMore(targetPage < response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMyRides(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMyRides(nextPage, false);
  };

  const handleUpdateRide = async (rideId, updatedData) => {
    try {
      const isCancelling = updatedData.status === 'cancelled';
      let payload;
      let response;

      if (isCancelling) {
        // Special endpoint that cascades to bookings
        response = await axiosInstance.put(`/rides/${rideId}/cancel`);
      } else {
        // Normal update
        payload = {
          status: updatedData.status,
          availableSeats: Number(updatedData.totalSeats),
          pricePerSeat: Number(updatedData.fare),
        };
        response = await axiosInstance.put(`/rides/${rideId}`, payload);
      }

      if (response.data.success) {
        toast.success(response.data.message || "Details Updated Successfully");

        // Update local state
        setRides(prev => prev.map(ride => {
          if (ride.id === rideId) {
            return {
              ...ride,
              status: updatedData.status === 'scheduled' ? 'upcoming' : updatedData.status,
              fare: isCancelling ? ride.fare : payload.pricePerSeat,
              totalSeats: isCancelling ? ride.totalSeats : payload.availableSeats,
              emptySeats: isCancelling ? ride.emptySeats : (payload.availableSeats - ride.bookedSeats),
            };
          }
          return ride;
        }));
      }
    } catch (error) {
      console.error("Error updating ride:", error);
      toast.error(error.response?.data?.message || "Failed to update ride");
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50">
      <DriverNavbar />

      <main className="max-w-5xl mx-auto px-6 py-12 mt-16">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Scheduled Rides
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            Review your upcoming journeys and trip history.
          </p>
        </div>

        {/* Rides Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary text-slate-900 dark:text-white"></div>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            You don't have any scheduled rides.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} onUpdate={handleUpdateRide} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More Scheduled Rides"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ScheduleRidesPage;
