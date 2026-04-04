import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/LandingPage/layout/Navbar";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // New state for admin toggle
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we were redirected here from a specific action (like clicking 'Offer a Ride' while logged out)
  const from = location.state?.from || "/my-profile";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);
  const handleToggleLoginType = () => setIsAdminLogin((prev) => !prev);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Append the selected role to the payload based on toggle state
      const payload = { ...data, role: isAdminLogin ? "admin" : "user" };
      const response = await axiosInstance.post("/auth/login", payload);
      const result = response.data;

      // Store token and user data
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast.success(result.message || `Login successful as ${result.user.role.toUpperCase()}!`, {
        duration: 4000,
        position: "top-center",
        style: {
          borderRadius: "12px",
          background: "#1A1A1A",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
        },
      });

      // Redirect admin users to a different path if necessary
      if (result.user.role === 'admin') {
        navigate('/admin'); // Redirect admins to admin dashboard
      } else if (result.user.role === 'driver') {
        navigate(from === '/my-profile' ? '/driverdashboard' : from);
      } else {
        navigate(from);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to login";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFB] min-h-screen flex flex-col font-sans">
      <Toaster />
      <Navbar />

      <main className="flex-1 flex px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14 max-w-[1400px] mx-auto w-full gap-8 lg:gap-16">
        {/* Left Brand Panel - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-green-900/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-inner">
              <span className="material-symbols-outlined text-4xl text-white">directions_car</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-[1.15] tracking-tight">
              Unlock a better way<br />to commute.
            </h2>
            <p className="text-green-50 text-lg max-w-md leading-relaxed font-medium opacity-90">
              Join the RideShare community. Connect with verified peers, reduce your carbon footprint, and make every journey more enjoyable.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-5 bg-white/10 w-fit px-6 py-4 rounded-2xl backdrop-blur-md border border-white/20 mt-12">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-11 h-11 rounded-full border-2 border-[#047857] bg-green-100 flex items-center justify-center overflow-hidden shadow-sm">
                  <span className="material-symbols-outlined text-[#047857] text-lg">person</span>
                </div>
              ))}
            </div>
            <div className="text-sm font-medium">
              <span className="block text-white text-base">Over 10,000+</span>
              <span className="text-green-100 font-normal">Active ride-sharers</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-[480px] bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 lg:p-12 relative">

            {/* Login Type Toggle */}
            <div className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center bg-slate-100 p-1 rounded-full">
              <button
                type="button"
                onClick={() => setIsAdminLogin(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!isAdminLogin
                  ? "bg-white text-[#1A1A1A] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setIsAdminLogin(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isAdminLogin
                  ? "bg-[#10b981] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                Admin
              </button>
            </div>

            <div className="text-left mb-10 mt-4">
              <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
                {isAdminLogin ? "Admin Portal" : "Welcome back"}
              </h1>
              <p className="text-base text-slate-500 font-medium">
                {isAdminLogin
                  ? "Sign in to manage the platform."
                  : "Enter your details to access your account."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2.5">
                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="name@example.com"
                    className={`w-full py-4 pl-4 pr-11 bg-slate-50 border-2 ${errors.email ? "border-red-500" : "border-slate-100"
                      } rounded-2xl text-base text-[#1A1A1A] outline-none transition-all focus:bg-white focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 placeholder:text-slate-400 group-hover:border-slate-200`}
                  />
                  <span className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[22px] transition-colors ${errors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#10b981]'}`}>
                    mail
                  </span>
                </div>
                {errors.email && (
                  <p role="alert" className="text-sm text-red-500 font-semibold flex items-center gap-1 mt-1.5">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-bold text-[#10b981] hover:text-[#047857] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Must be at least 6 characters",
                      },
                    })}
                    placeholder="••••••••"
                    className={`w-full py-4 pl-4 pr-11 bg-slate-50 border-2 ${errors.password ? "border-red-500" : "border-slate-100"
                      } rounded-2xl text-base text-[#1A1A1A] outline-none transition-all focus:bg-white focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 placeholder:text-slate-400 group-hover:border-slate-200`}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className={`material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[22px] transition-colors hover:text-slate-700 ${errors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-[#10b981]'}`}
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="text-sm text-red-500 font-semibold flex items-center gap-1 mt-1.5">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 bg-[#1A1A1A] hover:bg-black rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all group mt-6 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] ${isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "active:scale-[0.98]"
                  }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center">
              <p className="text-center text-base text-slate-500 font-medium">
                Don't have an account?
                <Link
                  to="/signup"
                  state={location.state}
                  className="text-[#10b981] font-bold hover:text-[#047857] transition-colors ml-2"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
