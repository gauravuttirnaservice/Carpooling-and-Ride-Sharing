import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-bold tracking-wide transition-colors ${isActive
      ? "text-primary border-b-2 border-primary pb-1"
      : isHome
        ? "text-white/80 hover:text-white"
        : "text-slate-500 hover:text-slate-900"
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `text-lg font-black tracking-tight ${isActive ? "text-primary" : "text-slate-500 hover:text-slate-900"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 z-[100] w-full border-b h-20 transition-all duration-300 ${isHome
        ? "border-white/10 bg-white/5 backdrop-blur-md"
        : "border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm"
        }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] border-2 transition-all duration-300 shadow-sm ${isHome
              ? "bg-white/10 border-white/20 text-white group-hover:bg-primary group-hover:border-primary"
              : "bg-slate-50 border-slate-100 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary"
              }`}
          >
            <span className="material-symbols-outlined !text-[26px]">
              directions_car
            </span>
          </div>
          <h2
            className={`text-2xl font-black leading-tight tracking-tight ${isHome ? "text-white" : "text-slate-900"
              }`}
          >
            RideShare <span className={isHome ? "text-[#3edc4e]" : "text-primary"}>Connect</span>
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-10">
          <nav className="flex items-center gap-8 mt-1">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/find-ride" className={navLinkClasses}>
              Find a Ride
            </NavLink>
          </nav>

          <div
            className={`flex items-center gap-4 border-l pl-8 ${isHome ? "border-white/20" : "border-slate-200"
              }`}
          >
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/my-profile")}
                  className={`flex h-12 items-center justify-center rounded-full px-8 border text-sm font-black tracking-wide transition-all duration-300 ${isHome
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/offer-ride")}
                  className={`flex h-12 items-center justify-center rounded-full px-8 text-sm font-black tracking-wide text-white transition-all duration-300 shadow-lg active:scale-95 ${isHome
                    ? "bg-[#1da046] hover:bg-green-700 shadow-green-500/20"
                    : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                    }`}
                >
                  Offer a Ride
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={`text-sm font-black tracking-wide transition-colors px-2 ${isHome
                    ? "text-white/80 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/login", { state: { from: "/offer-ride" } })}
                  className={`flex h-12 items-center justify-center rounded-full px-8 text-sm font-black tracking-wide text-white transition-all duration-300 shadow-lg active:scale-95 ${isHome
                    ? "bg-[#1da046] hover:bg-green-700 shadow-green-500/20"
                    : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                    }`}
                >
                  Offer a Ride
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden flex items-center justify-center h-12 w-12 rounded-full transition-colors focus:outline-none ${isHome
            ? "bg-white/10 text-white active:bg-white/20"
            : "bg-slate-50 text-slate-900 active:bg-slate-100"
            }`}
        >
          <span className="material-symbols-outlined !text-3xl">
            {mobileMenuOpen ? "close" : "menu_open"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`${mobileMenuOpen ? "block" : "hidden"
          } md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 rounded-b-3xl`}
      >
        <nav className="flex flex-col p-6 gap-6">
          <NavLink
            to="/"
            className={mobileNavLinkClasses}
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/find-ride"
            className={mobileNavLinkClasses}
            onClick={closeMobileMenu}
          >
            Find a Ride
          </NavLink>

          <div className="w-full h-px bg-slate-100 my-2"></div>

          <div className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/my-profile");
                    closeMobileMenu();
                  }}
                  className="w-full h-14 rounded-full bg-slate-50 border-2 border-slate-100 font-black tracking-wide text-slate-900 hover:bg-slate-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/offer-ride");
                    closeMobileMenu();
                  }}
                  className="w-full h-14 rounded-full bg-slate-900 font-black tracking-wide text-white shadow-lg"
                >
                  Offer a Ride
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMobileMenu();
                  }}
                  className="w-full h-14 rounded-full bg-slate-50 border-2 border-slate-100 font-black tracking-wide text-slate-900"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/login", { state: { from: "/offer-ride" } });
                    closeMobileMenu();
                  }}
                  className="w-full h-14 rounded-full bg-slate-900 font-black tracking-wide text-white shadow-lg"
                >
                  Offer a Ride
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
