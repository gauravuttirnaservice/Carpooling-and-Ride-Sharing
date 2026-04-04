import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const allNavLinks = [
    { name: "Home", path: "/", isPrivate: false },

    { name: "My Rides", path: "/my-ride", isPrivate: true },
    { name: "Payment History", path: "/user-payment-history", isPrivate: true },
    { name: "My Profile", path: "/my-profile", isPrivate: true },
  ];

  const navLinks = allNavLinks.filter(link => !link.isPrivate || isAuthenticated);

  return (
    <header className="w-full bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="px-6 md:px-12 lg:px-40 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined !text-3xl font-bold">
              local_taxi
            </span>
          </div>
          <Link
            to="/"
            className="text-xl font-bold leading-tight tracking-tight text-text-main dark:text-white"
          >
            RideShare Connect
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-2 mr-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-all"
                href={link.path}
              >
                {link.name}
              </a>
            ))}
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl h-10 px-6 border border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white text-sm font-bold shadow-sm transition-all active:scale-95 group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">logout</span>
              <span className="truncate">Logout</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <span className="material-symbols-outlined !text-3xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 px-6 py-4 space-y-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="block text-base font-medium text-slate-900 dark:text-white hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <hr className="border-gray-100 dark:border-gray-800" />
          {isAuthenticated && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white border border-red-200 dark:border-red-500/20 text-base font-bold shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
