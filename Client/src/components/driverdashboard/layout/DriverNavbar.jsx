import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DriverNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/offer-ride", label: "Offer a Ride" },
    { path: "/scheduled-rides", label: "My Scheduled Rides" },
    { path: "/payment-history", label: "Payment History" },

  ];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 z-[100] shadow-sm">
        <div className="px-6 md:px-12 lg:px-40 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined !text-3xl font-bold">
                local_taxi
              </span>
            </div>
            <NavLink
              to="/"
              className="text-xl font-bold leading-tight tracking-tight text-text-main dark:text-white"
            >
              RideShare Connect
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <nav className="flex items-center gap-9">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive
                      ? "text-primary font-bold border-b-2 border-primary pb-1"
                      : "text-slate-600 dark:text-slate-300 hover:text-primary"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-sm hover:opacity-90 transition-opacity active:scale-95"
            >
              <span className="truncate">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-slate-900 dark:text-white"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[110] bg-white dark:bg-background-dark md:hidden transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium ${isActive ? "text-primary font-bold" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="border-slate-100 dark:border-slate-800" />
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default DriverNavbar;
