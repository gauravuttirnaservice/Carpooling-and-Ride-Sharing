import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Rocket, ShieldCheck, Wallet, Leaf, ArrowRight, AlertCircle } from "lucide-react";
import Navbar from "../components/LandingPage/layout/Navbar";
import BasicInformationForm from "../components/LandingPage/signup/BasicInformationForm";
import axiosInstance from "../utils/axiosInstance";

// Validation helpers
const validateAge = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 18;
};

const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return true;
  return file.size <= maxSizeMB * 1024 * 1024;
};

const validateFileType = (file, allowedTypes = []) => {
  if (!file) return true;
  const extension = file.name.split(".").pop().toLowerCase();
  return allowedTypes.includes(extension);
};

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const driverSectionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      role: "user",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      dob: "",
      gender: "",
      address: "",
      idProof: null,
      termsAccepted: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = data;

      const [firstName, ...lastNameParts] = submitData.username ? submitData.username.split(' ') : ['User'];
      const lastName = lastNameParts.join(' ') || firstName;

      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', submitData.email);
      formData.append('password', submitData.password);
      formData.append('dateOfBirth', submitData.dob);
      formData.append('gender', submitData.gender);
      formData.append('phoneNumber', submitData.phone);
      formData.append('address', submitData.address);
      formData.append('role', "user");

      if (submitData.profilePicture && submitData.profilePicture[0]) {
        formData.append('profilePicture', submitData.profilePicture[0]);
      }

      const response = await axiosInstance.post("/auth/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = response.data;

      toast.success(result.message || "Account created successfully! Welcome to RideShare.", {
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

      setTimeout(() => {
        navigate("/login", { state: location.state });
      }, 1500);
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
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
        <div className="hidden lg:flex flex-col justify-between w-[40%] bg-gradient-to-br from-[#1A1A1A] to-[#2d2d2d] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-black/20 fixed-left-panel h-fit sticky top-28">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#10b981]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#10b981]/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-inner">
              <Rocket className="w-8 h-8 text-[#10b981]" strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-[1.15] tracking-tight">
              Start your<br />journey today.
            </h2>
            <p className="text-slate-300 text-lg max-w-md leading-relaxed font-medium">
              Create an account in minutes and get instant access to reliable rides and verified drivers in your city.
            </p>
          </div>

          <div className="relative z-10 space-y-6 mt-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Verified Users</h4>
                <p className="text-sm text-slate-400 mt-0.5">Trust and safety first</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                <Wallet className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Cost Effective</h4>
                <p className="text-sm text-slate-400 mt-0.5">Save money on every ride</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10b981]/20 flex items-center justify-center text-[#10b981]">
                <Leaf className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Eco-Friendly</h4>
                <p className="text-sm text-slate-400 mt-0.5">Reduce your carbon footprint</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-[60%] flex items-start justify-center pt-2">
          <div className="w-full max-w-2xl bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 lg:p-8">

            <div className="mb-10 lg:mb-12">
              <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-3 tracking-tight">
                Create Account
              </h1>
              <p className="text-base text-slate-500 font-medium">
                Please fill in the details to register your new account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              <div className="bg-[#F8FAFB] rounded-3xl p-6 sm:p-8 border border-slate-100/60">
                <BasicInformationForm
                  register={register}
                  errors={errors}
                  control={control}
                  password={password}
                  validateAge={validateAge}
                  validateFileSize={validateFileSize}
                  validateFileType={validateFileType}
                />
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-4 p-5 bg-[#F8FAFB] rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="relative flex items-start mt-1">
                  <input
                    type="checkbox"
                    id="termsCheckbox"
                    {...register("termsAccepted", {
                      required: "You must accept the terms and conditions",
                    })}
                    className="w-5 h-5 text-[#10b981] bg-white border-2 border-slate-300 rounded cursor-pointer focus:ring-[#10b981] focus:ring-offset-2 transition-all checked:border-[#10b981]"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="termsCheckbox"
                    className="text-sm text-slate-600 font-medium cursor-pointer leading-relaxed block"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-[#1A1A1A] font-bold hover:text-[#10b981] transition-colors underline decoration-slate-300 underline-offset-2">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#1A1A1A] font-bold hover:text-[#10b981] transition-colors underline decoration-slate-300 underline-offset-2">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                      {errors.termsAccepted.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 bg-[#10b981] hover:bg-[#0ea5e9] text-white rounded-2xl font-bold text-lg shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] transition-all flex items-center justify-center gap-3 group mt-2 ${isLoading ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98] hover:bg-[#059669]"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create My Account</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    </>
                  )}
                </button>

                <div className="mt-10 flex items-center justify-center">
                  <p className="text-center text-base text-slate-500 font-medium">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      state={location.state}
                      className="text-[#1A1A1A] font-bold hover:text-[#10b981] transition-colors ml-2 underline decoration-slate-200 underline-offset-4"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
