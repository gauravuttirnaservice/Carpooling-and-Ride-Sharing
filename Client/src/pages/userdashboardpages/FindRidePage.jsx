import { useState, useEffect } from "react";
import SearchBar from "../../components/userdashboard/findRide/SearchBar";
import FilterChips from "../../components/userdashboard/findRide/FilterChips";
import RideCard from "../../components/userdashboard/findRide/RideCard";
import Sidebar from "../../components/userdashboard/findRide/Sidebar";
import UserNavbar from "../../components/userdashboard/layout/UserNavbar";
import axiosInstance from "../../utils/axiosInstance";
import { useSearchContext } from "../../contexts/SearchContext";

const FindRidePage = () => {
  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreRides, setHasMoreRides] = useState(false);
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  // States driven by Context
  const { searchParams, setSearchParams, hasSearched, setHasSearched } = useSearchContext();

  const [filters, setFilters] = useState({
    priceFilter: [], // "under_1000", "1000_5000", "5000_10000", "10000_20000"
    timeSlot: [],    // "early_morning", "morning", "afternoon", "evening"
  });

  const [sortBy, setSortBy] = useState("earliest"); // "cheapest", "earliest", "topRated"

  // Refetch when filters, sortBy, or context's hasSearched changes 
  // (e.g., coming from the Home page)
  useEffect(() => {
    if (hasSearched) {
      setPage(1);
      fetchRides(searchParams, filters, sortBy, 1, true);
    }
  }, [filters, sortBy, hasSearched]);

  const fetchRides = async (params, currentFilters, currentSortBy, targetPage = 1, reset = false) => {
    setLoading(true);
    try {
      // Construct query string
      const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.date,
        passengers: params.passengers,
        sortBy: currentSortBy,
        page: targetPage,
        limit: LIMIT,
      });

      if (currentFilters.priceFilter && currentFilters.priceFilter.length > 0) {
        currentFilters.priceFilter.forEach((pf) => queryParams.append("priceFilter", pf));
      }

      if (currentFilters.timeSlot && currentFilters.timeSlot.length > 0) {
        currentFilters.timeSlot.forEach((ts) => queryParams.append("timeSlot", ts));
      }

      const response = await axiosInstance.get(`/rides?${queryParams.toString()}`);

      if (response.data && response.data.success) {
        // Exclude rides where the current user is the driver
        const userStr = localStorage.getItem("user");
        const currentUser = userStr ? JSON.parse(userStr) : null;
        const currentUserId = currentUser ? currentUser.id : null;

        const filteredRidesData = response.data.data.filter(
          (ride) => ride.driverId !== currentUserId
        );

        const formattedRides = filteredRidesData.map((ride) => {
          const baseURL = axiosInstance.defaults.baseURL.replace("/api", "");
          const avatarUrl = ride.driver?.profilePicture
            ? `${baseURL}${ride.driver.profilePicture}`
            : `https://ui-avatars.com/api/?name=${ride.driver?.firstName || "User"}+${ride.driver?.lastName || ""}&background=random`;

          return {
            id: ride.id,
            driver: {
              name: ride.driver ? (ride.driver.firstName === ride.driver.lastName ? ride.driver.firstName : `${ride.driver.firstName} ${ride.driver.lastName}`) : "Unknown Driver",
              avatar: avatarUrl,
              rating: ride.driver && ride.driver.rating !== undefined ? ride.driver.rating : 5.0,
            },
            departure: {
              time: new Date(ride.departureTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              city: ride.origin,
              location: ride.origin,
            },
            arrival: {
              time: ride.arrivalTime
                ? new Date(ride.arrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "TBD",
              city: ride.destination,
              location: ride.destination,
            },
            car: {
              model: ride.carName || "Standard Car",
              color: "N/A",
              icon: "directions_car",
            },
            price: ride.pricePerSeat,
            seatsLeft: ride.availableSeats,
            status: ride.status || "scheduled",
          };
        });
        setRides((prev) => reset ? formattedRides : [...prev, ...formattedRides]);
        setHasMoreRides(targetPage < response.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      if (reset) setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRides(searchParams, filters, sortBy, nextPage, false);
  };

  const handleSearchSubmit = (data) => {
    setSearchParams(data);
    setHasSearched(true);
    setPage(1);
    fetchRides(data, filters, sortBy, 1, true);
  };

  // Removed manual slicing override, utilizing DB page constraints instead

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display transition-colors">
      <UserNavbar />

      {/* Decorative Hero Background - dynamic based on search state */}
      <div
        className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out z-0 bg-slate-900 dark:bg-[#0f1714] ${hasSearched ? "h-[320px]" : "h-[450px]"
          }`}
      >
        {/* Subtle decorative patterns */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10"></div>
        <div className="absolute top-20 right-[10%] w-[30vw] h-[30vw] min-w-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-[10%] w-[20vw] h-[20vw] min-w-[200px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <section className="mb-8">

          {/* Hero text changes dynamically */}
          <div className="text-center md:text-left mb-6 mt-6 md:mt-12 transition-all">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-sm">
              {hasSearched ? "Your rides are ready." : "Where are you heading?"}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl font-medium">
              {hasSearched ? "Hundreds of verified drivers, thousands of fresh routes." : "Enter your origin, destination, and departure date to find a ride."}
            </p>
          </div>

          <div className="relative z-50 transform -translate-y-2">
            <SearchBar
              defaultValues={searchParams}
              onSearch={handleSearchSubmit}
            />
          </div>

          {hasSearched && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-8 mb-4">
              <div className="flex-1 bg-white/60 dark:bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-sm inline-block w-max">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  {searchParams.from}
                  <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                  {searchParams.to}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-0.5 uppercase tracking-wide">
                  {rides.length} rides • {new Date(searchParams.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                </p>
              </div>
              <FilterChips sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          )}
        </section>

        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 mt-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full shadow-xl flex items-center justify-center mb-6 ring-8 ring-slate-100 dark:ring-slate-800/50">
              <span className="material-symbols-outlined text-5xl text-primary bg-clip-text">directions_car</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">No active search yet!</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium">Join thousands of verified commuters saving time and expenses by ride-sharing safely every single day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mt-6 animate-in fade-in duration-500">
            <aside className="lg:col-span-3 sticky top-24 z-20">
              <Sidebar filters={filters} onFilterChange={setFilters} />
            </aside>

            <div className="lg:col-span-9 space-y-5">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                </div>
              ) : rides.length === 0 ? (
                <div className="text-center py-20 px-4 bg-white dark:bg-[#15241b] rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">route</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Hmm, no rides found.</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm mx-auto">Try adjusting your filters, searching a nearby city, or picking a different date entirely.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {rides.map((ride) => (
                    <RideCard key={ride.id} ride={ride} />
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMoreRides && !loading && (
                <div className="pt-8 pb-4 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15241b] text-slate-900 dark:text-white font-bold hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-lg hover:-translate-y-1 group"
                  >
                    <span>Load more rides</span>
                    <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform">expand_more</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FindRidePage;
