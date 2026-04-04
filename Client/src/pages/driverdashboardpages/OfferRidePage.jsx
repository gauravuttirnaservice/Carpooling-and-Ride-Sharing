import { useForm, useWatch, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DriverNavbar from "../../components/driverdashboard/layout/DriverNavbar";
import { useState, useEffect, useRef } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import DatePickerInput from "../../components/DatePicker/DatePicker";
import { useCityContext } from "../../contexts/CityContext";
import {
  Map, MapPin, Flag, Calendar as CalendarIcon, Clock, Users, IndianRupee,
  ShieldCheck, CreditCard, Image as ImageIcon, Car, Hash, Landmark,
  Building, MapPinned, CornerDownRight, ArrowRight
} from "lucide-react";

const OfferRidePage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur", // Validate on blur
    defaultValues: {
      leavingFrom: '',
      goingTo: ''
    }
  });

  const { popularCities } = useCityContext();
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [hasExistingLicense, setHasExistingLicense] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fromValue = useWatch({ control, name: 'leavingFrom' }) || '';
  const toValue = useWatch({ control, name: 'goingTo' }) || '';
  const drivingLicenseFile = useWatch({ control, name: 'drivingLicense' });
  const selectedFileName = drivingLicenseFile && drivingLicenseFile.length > 0 ? drivingLicenseFile[0].name : null;

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Fetch driver details to pre-fill the form
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.data.success && response.data.user) {
          const user = response.data.user;
          // Pre-fill the fields. Using setValue to avoid wiping out fields if they typed something quickly
          if (user.vehicleModel) setValue('carName', user.vehicleModel);
          if (user.registrationNumber) setValue('carNumber', user.registrationNumber);
          if (user.bankAccount) setValue('accountNumber', user.bankAccount);
          if (user.ifscCode) setValue('ifscCode', user.ifscCode);
          if (user.aadharCard) setValue('aadharCard', user.aadharCard);
          if (user.licenseNumber) {
            setHasExistingLicense(true);
            clearErrors('drivingLicense');
          }
        }
      } catch (error) {
        console.error("Failed to fetch driver details:", error);
      }
    };
    fetchDriverDetails();
  }, [setValue]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilteredCities = (searchTerm) => {
    if (!searchTerm) return popularCities;

    const term = searchTerm.toLowerCase();

    // Filter and reconstruct the object to only show matching elements
    const filtered = popularCities.map(cityObj => {
      // 1. If the city name matches, show the city and alDl its points
      if (cityObj.city.toLowerCase().includes(term)) {
        return cityObj;
      }

      // 2. If the city name doesn't match, check if any points match
      const matchingPoints = cityObj.points.filter(point =>
        point.toLowerCase().includes(term)
      );

      // Only return the city group if there are matching points
      if (matchingPoints.length > 0) {
        return {
          ...cityObj,
          points: matchingPoints
        };
      }
      return null;
    }).filter(Boolean); // remove nulls

    return filtered;
  };

  const handleSelectOption = (field, value) => {
    setValue(field, value, { shouldValidate: true });
    if (field === 'leavingFrom') setShowFromDropdown(false);
    if (field === 'goingTo') setShowToDropdown(false);
  };

  const validateCity = (value) => {
    // Flatten all valid strings: Cities and 'Point, City' combinations
    const validLocations = popularCities.flatMap(cityObj => [
      cityObj.city,
      ...cityObj.points.map(point => `${point}, ${cityObj.city}`)
    ]);

    // Check if the exact typed value exists in our dataset
    const isValid = validLocations.some(
      loc => loc.toLowerCase() === value.toLowerCase()
    );

    return isValid || "Please select a valid location from the dropdown";
  };

  // Reusable Dropdown Component
  const DropdownList = ({ field, searchValue }) => {
    const data = getFilteredCities(searchValue);

    if (data.length === 0) {
      return (
        <div className="absolute top-[105%] left-0 w-full min-w-[250px] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-[100] text-sm text-slate-500 text-center italic dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
          No locations found.
        </div>
      );
    }

    return (
      <div className="absolute top-[105%] left-0 w-full min-w-[250px] max-h-[320px] overflow-y-auto overflow-x-hidden bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-[100] scrollbar-hide animate-in fade-in slide-in-from-top-2 duration-200 dark:bg-slate-800 dark:border-slate-700">
        <ul className="flex flex-col gap-1 text-sm text-slate-700">
          {data.map((cityObj) => (
            <li key={`group-${field}-${cityObj.city}`} className="flex flex-col">
              {/* Main City Header */}
              <div
                className="font-bold text-xs uppercase tracking-wider text-slate-500 px-3 py-2 mt-1 bg-slate-50 dark:bg-slate-700/50 dark:text-slate-400 rounded-md select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                onClick={() => handleSelectOption(field, cityObj.city)}
              >
                <span className="flex items-center gap-2">
                  <MapPinned className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  {cityObj.city}
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">City</span>
              </div>

              {/* City Sub-Points */}
              {cityObj.points.map((point) => {
                const fullValue = `${point}, ${cityObj.city}`;
                return (
                  <button
                    type="button"
                    key={`option-${field}-${cityObj.city}-${point}`}
                    className="w-full text-left px-3 py-2.5 ml-4 dark:text-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    onMouseDown={(e) => {
                      // use onMouseDown instead of onClick so it fires before the input's onBlur event hides the dropdown
                      e.preventDefault();
                      handleSelectOption(field, fullValue);
                    }}
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                    <span className="truncate flex-1">{point}</span>
                  </button>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const onSubmit = async (data) => {
    if (!hasExistingLicense && (!data.drivingLicense || data.drivingLicense.length === 0)) {
      setError("drivingLicense", { type: "manual", message: "Driving License upload is required" });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'drivingLicense' && data[key] && data[key].length > 0) {
          formData.append(key, data[key][0]); // Append the actual file only if uploaded
        } else if (key !== 'drivingLicense') {
          formData.append(key, data[key]);
        }
      });

      // We no longer send mock coordinates here, because the backend dynamically fetches actual Nominatim Coordinates based on leavingFrom / goingTo


      const response = await axiosInstance.post("/rides/offer", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Ride Saved Successfully");
        reset();
        // Navigate to scheduled rides after publishing
        navigate("/scheduled-rides");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish ride");
      console.error("Error offering ride:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-200">
      <DriverNavbar />

      <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col max-w-[800px] w-full gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-3">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight">
              Offer a ride
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Share your journey and save on travel costs. Fill in the details
              below to publish your ride.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 bg-white dark:bg-[#1a3322] p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            {/* Route Details Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <Map className="w-5 h-5 text-primary" strokeWidth={2.5} />
                <h3 className="text-lg font-bold">Route Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Leaving From */}
                <div ref={fromRef} className="flex flex-col group relative">
                  <span className="text-sm font-semibold pb-2">
                    Leaving from <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <MapPin className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      {...register("leavingFrom", {
                        required: "Starting location is required",
                        validate: validateCity
                      })}
                      onFocus={() => setShowFromDropdown(true)}
                      autoComplete="off"
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.leavingFrom
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. Nashik"
                    />
                  </div>
                  {errors.leavingFrom && (
                    <span className="text-red-500 text-xs mt-1 font-medium absolute -bottom-5">
                      {errors.leavingFrom.message}
                    </span>
                  )}
                  {/* Datalist Dropdown */}
                  {showFromDropdown && fromValue && <DropdownList field="leavingFrom" searchValue={fromValue} />}
                </div>

                {/* Going To */}
                <div ref={toRef} className="flex flex-col group relative">
                  <span className="text-sm font-semibold pb-2">
                    Going to <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <Flag className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      {...register("goingTo", {
                        required: "Destination is required",
                        validate: validateCity
                      })}
                      onFocus={() => setShowToDropdown(true)}
                      autoComplete="off"
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.goingTo
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  {errors.goingTo && (
                    <span className="text-red-500 text-xs mt-1 font-medium absolute -bottom-5">
                      {errors.goingTo.message}
                    </span>
                  )}
                  {/* Datalist Dropdown */}
                  {showToDropdown && toValue && <DropdownList field="goingTo" searchValue={toValue} />}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <CalendarIcon className="w-5 h-5 text-primary" strokeWidth={2.5} />
                <h3 className="text-lg font-bold">Schedule</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Date */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Date <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">

                    <Controller
                      name="date"
                      control={control}
                      rules={{
                        required: "Date is required",
                        validate: (value) => {
                          const selectedDate = new Date(value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return (
                            selectedDate >= today ||
                            "Date cannot be in the past"
                          );
                        },
                      }}
                      render={({ field }) => (
                        <DatePickerInput
                          label=""
                          value={field.value}
                          onChange={field.onChange}
                          disablePast={true}
                          className={`w-full rounded-2xl border-2 bg-white dark:bg-slate-800/50 hover:border-slate-300 focus-within:ring-4 focus-within:ring-primary/10 transition-all relative z-0 ${errors.date ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`}
                          slotProps={{
                            textField: {
                              error: !!errors.date,
                              placeholder: "Departure Date",
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '1rem',
                                  height: '3.5rem',
                                  backgroundColor: 'transparent'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none',
                                },
                                '& .MuiInputBase-input': {
                                  paddingLeft: '3rem',
                                  fontSize: '1rem',
                                  fontWeight: 500,
                                  color: 'inherit'
                                }
                              }
                            }
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.date && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.date.message}
                    </span>
                  )}
                </label>

                {/* Start Time */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Start Time <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <Clock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      type="time"
                      {...register("startTime", {
                        required: "Start time is required",
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.startTime
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                    />
                  </div>
                  {errors.startTime && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.startTime.message}
                    </span>
                  )}
                </label>

                {/* End Time */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    End/Arrival Time <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 material-symbols-outlined text-slate-400 group-focus-within:text-primary">
                      schedule
                    </span>
                    <input
                      type="time"
                      {...register("endTime", {
                        required: "Arrival time is required",
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.endTime
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                    />
                  </div>
                  {errors.endTime && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.endTime.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Ride Details Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <Users className="w-5 h-5 text-primary" strokeWidth={2.5} />
                <h3 className="text-lg font-bold">Ride Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Available Seats */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Available Seats <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <Users className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      type="number"
                      {...register("seats", {
                        required: "Number of seats is required",
                        min: {
                          value: 1,
                          message: "At least 1 seat is required",
                        },
                        max: {
                          value: 8,
                          message: "Maximum 8 seats allowed",
                        },
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.seats
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      defaultValue={1}
                    />
                  </div>
                  {errors.seats && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.seats.message}
                    </span>
                  )}
                </label>

                {/* Price per Seat */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Price per Seat <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <IndianRupee className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      type="number"
                      step="0.5"
                      {...register("price", {
                        required: "Price is required",
                        min: {
                          value: 1,
                          message: "Price must be at least ₹1",
                        },
                        max: {
                          value: 10000,
                          message: "Price cannot exceed ₹10,000",
                        },
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.price
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. 25.00"
                    />
                  </div>
                  {errors.price && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.price.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Verification Details Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/50">
                <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={2.5} />
                <h3 className="text-lg font-bold">Driver Verification</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Aadhar Card */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Aadhar Card Number <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <CreditCard className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      type="text"
                      maxLength={12}
                      {...register("aadharCard", {
                        required: "Aadhar format: 12 digits required",
                        pattern: {
                          value: /^\d{12}$/,
                          message: "Must be exactly 12 digits"
                        }
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.aadharCard
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. 1234 5678 9012"
                    />
                  </div>
                  {errors.aadharCard && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.aadharCard.message}
                    </span>
                  )}
                </label>

                {/* Driving License */}
                <label className="flex flex-col group sm:col-span-2">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-semibold">
                      Driving License Photo {!hasExistingLicense && <span className="text-red-500">*</span>}
                    </span>
                    {hasExistingLicense && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/40 dark:text-green-400">
                        Saved on file
                      </span>
                    )}
                  </div>
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-2xl transition-all ${errors.drivingLicense ? 'border-dashed border-red-300 bg-red-50 dark:bg-red-900/10' : (hasExistingLicense && !selectedFileName) ? 'border-solid border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10' : 'border-dashed border-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:bg-slate-800'} flex-col items-center`}>
                    {hasExistingLicense && !selectedFileName ? (
                      <div className="space-y-3 text-center w-full flex flex-col items-center">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-1">
                          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="text-emerald-900 dark:text-emerald-100 font-bold mb-0.5">Verified Driving License</h4>
                          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400/80">Your license document is securely uploaded.</p>
                        </div>
                        <span className="relative cursor-pointer mt-2 inline-flex items-center gap-2 px-4 py-2 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/60 transition-colors focus-within:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white dark:bg-emerald-900/50 shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>
                          Update Document
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            {...register("drivingLicense")}
                            className="sr-only"
                          />
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center w-full animate-in fade-in zoom-in-95 duration-200">
                        <ImageIcon className="w-10 h-10 text-slate-400 mb-2 mx-auto" strokeWidth={1.5} />
                        <div className="flex flex-col sm:flex-row items-center font-medium text-sm text-slate-600 dark:text-slate-400 justify-center gap-1.5">
                          <span className="relative cursor-pointer rounded-md font-bold text-primary hover:text-green-600 focus-within:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            <span>{selectedFileName ? selectedFileName : "Upload a file"}</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              {...register("drivingLicense")}
                              className="sr-only"
                            />
                          </span>
                          {!selectedFileName && <span>or drag and drop</span>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                          PNG, JPG, PDF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.drivingLicense && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.drivingLicense.message}
                    </span>
                  )}
                </label>

                {/* Car Name */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Car Name <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <Car className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      type="text"
                      {...register("carName", {
                        required: "Car Name is required"
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.carName
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. Maruti Swift"
                    />
                  </div>
                  {errors.carName && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.carName.message}
                    </span>
                  )}
                </label>

                {/* Car Number */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Car Plate Number <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center group">
                    <Hash className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-primary z-10 transition-colors" strokeWidth={2.5} />
                    <input
                      type="text"
                      {...register("carNumber", {
                        required: "Car Plate is required"
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.carNumber
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. MH15 DA 1234"
                    />
                  </div>
                  {errors.carNumber && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.carNumber.message}
                    </span>
                  )}
                </label>

                {/* Account Number */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    Account Number <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 material-symbols-outlined text-slate-400 group-focus-within:text-primary">
                      account_balance
                    </span>
                    <input
                      type="text"
                      minLength={8}
                      maxLength={12}
                      {...register("accountNumber", {
                        required: "Account Number is required",
                        pattern: {
                          value: /^[0-9]{8,12}$/,
                          message: "Account Number must be 8-12 digits"
                        }
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.accountNumber
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. 123456789012"
                    />
                  </div>
                  {errors.accountNumber && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.accountNumber.message}
                    </span>
                  )}
                </label>

                {/* IFSC Code */}
                <label className="flex flex-col group">
                  <span className="text-sm font-semibold pb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 material-symbols-outlined text-slate-400 group-focus-within:text-primary">
                      account_balance
                    </span>
                    <input
                      type="text"
                      maxLength={11}
                      {...register("ifscCode", {
                        required: "IFSC Code is required",
                        maxLength: { value: 11, message: "Invalid IFSC Code format" },
                        pattern: {
                          value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                          message: "Invalid IFSC Code format"
                        }
                      })}
                      className={`form-input w-full rounded-2xl h-14 pl-12 border-2 bg-white dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 hover:border-slate-300 transition-all font-medium relative z-0 ${errors.ifscCode
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-200 dark:border-slate-700"
                        }`}
                      placeholder="e.g. SBIN0001234"
                    />
                  </div>
                  {errors.ifscCode && (
                    <span className="text-red-500 text-xs mt-1 font-medium">
                      {errors.ifscCode.message}
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 rounded-xl text-white font-bold transition-all flex items-center justify-center group mt-4 ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-green-500 active:scale-[0.98] shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]"
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg">Publishing...</span>
                </>
              ) : (
                <>
                  <span className="mr-3 text-lg">Publish Ride</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OfferRidePage;
