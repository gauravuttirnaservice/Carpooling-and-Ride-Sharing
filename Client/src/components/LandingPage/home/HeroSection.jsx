import SearchForm from "./SearchForm";
import HeroImg2 from "../../../../assets/public/images/hero.png";

const HeroSection = () => {
  return (
    <div className="relative z-50 w-full min-h-[calc(100vh-80px)] md:min-h-[850px] flex items-center justify-center bg-slate-900">
      {/* Background Image covering the whole section */}
      <img
        src={HeroImg2}
        alt="Carpooling"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

      {/* Main Glassmorphism Container */}
      <div className="relative z-10 w-[95%] max-w-[1100px] mx-auto flex flex-col items-center justify-center px-6 py-12 md:px-16 md:py-20 rounded-[2.5rem] lg:rounded-[3rem] bg-white/5 backdrop-blur-[2.5px] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
        {/* Top Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10  backdrop-blur-[2.5px] 0border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.15em] mx-auto mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          JOIN 1M+ COMMUTERS
        </div>

        {/* Hero Text */}
        <div className="flex flex-col gap-6 max-w-[900px] text-center mb-16">
          <h1 className="text-white text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight drop-shadow-lg">
            Share Your Journey,{" "}
            <span className="text-[#3edc4e] drop-shadow-md">
              Save
              <br className="hidden sm:block" /> Money
            </span>
            , Save the Planet
          </h1>
          <p className="text-slate-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow mt-2">
            Discover the smartest way to travel. Cut costs, reduce traffic, and
            make new connections on your daily commute or next road trip.
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-5xl z-50 relative pb-2 lg:pb-0">
          <SearchForm />
        </div>
      </div>

      {/* Left Floating Map */}
      <div className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 w-[240px] h-[240px] rounded-3xl bg-white/5  backdrop-blur-[2.5px] border border-white/20 p-4 shadow-2xl flex-col items-center justify-center pointer-events-none">
        <div className="relative w-full h-full rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
          {/* Abstract Map Lines using pure CSS/SVG */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full opacity-50"
          >
            <path
              d="M0,20 L30,30 L40,10 L70,40 L100,20"
              stroke="white"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M0,50 L40,60 L50,40 L80,70 L100,50"
              stroke="white"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M20,0 L30,40 L10,80 L50,100"
              stroke="white"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M70,0 L60,30 L80,60 L60,100"
              stroke="white"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          {/* Abstract Route */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
          >
            <path
              d="M20,40 L40,60 L70,80"
              stroke="#3edc4e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="40" r="4" fill="#3edc4e" />
            <circle
              cx="70"
              cy="80"
              r="4"
              fill="#1e293b"
              stroke="#3edc4e"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Right Floating Badges */}
      <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 flex-col gap-5 pointer-events-none">
        <div className="w-[200px] px-5 py-4 rounded-3xl bg-white/5  backdrop-blur-[2.5px] border border-white/20 shadow-2xl flex items-center gap-4">
          <div className="w-[42px] h-[42px] rounded-full bg-slate-900/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#3edc4e] !text-[22px]">
              park
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm leading-tight text-shadow-sm">
              CO2
            </span>
            <span className="text-slate-100 text-xs font-medium leading-tight">
              Emissions
              <br />
              Saved
            </span>
          </div>
        </div>

        <div className="w-[200px] px-5 py-4 rounded-3xl bg-white/5  backdrop-blur-[2.5px] border border-white/20 shadow-2xl flex items-center gap-4">
          <div className="flex h-[42px] items-end justify-center gap-1 mx-1">
            <div className="w-1.5 h-3 bg-[#3edc4e] rounded-t-sm"></div>
            <div className="w-1.5 h-6 bg-[#3edc4e] rounded-t-sm opacity-80"></div>
            <div className="w-1.5 h-4 bg-[#3edc4e] rounded-t-sm opacity-60"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm leading-tight text-shadow-sm">
              Join 1M+
            </span>
            <span className="text-slate-100 text-xs font-medium leading-tight">
              Commuters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
