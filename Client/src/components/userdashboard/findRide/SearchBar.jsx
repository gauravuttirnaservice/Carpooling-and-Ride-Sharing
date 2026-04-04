import { useForm, useWatch, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from 'react';
import { useCityContext } from "../../../contexts/CityContext";
import DatePickerInput from "../../DatePicker/DatePicker";

export default function SearchBar({ defaultValues = {}, onSearch }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: defaultValues.from || "",
      to: defaultValues.to || "",
      date: defaultValues.date || "",
      passengers: defaultValues.passengers || "",
    },
  });

  const { popularCities } = useCityContext();
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const fromValue = useWatch({ control, name: 'from' }) || '';
  const toValue = useWatch({ control, name: 'to' }) || '';

  const fromRef = useRef(null);
  const toRef = useRef(null);

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
      // 1. If the city name matches, show the city and all its points
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
    if (field === 'from') setShowFromDropdown(false);
    if (field === 'to') setShowToDropdown(false);
  };

  const onSubmit = (data) => {
    if (onSearch) {
      onSearch(data);
    }
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
                  <span className="material-symbols-outlined text-[16px] text-primary">location_city</span>
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
                    <span className="material-symbols-outlined text-[14px] text-slate-400">subdirectory_arrow_right</span>
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

  return (
    <div className="relative z-20 bg-white dark:bg-[#15241b] rounded-[2rem] p-3 sm:p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5  mt-6 sm:mt-12 overflow-visible">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-3 items-center">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-1 w-full relative">

            {/* Connecting lines between inputs for desktop */}
            <div className="hidden lg:block absolute top-[28px] left-[25%] -ml-[1px] w-[1px] h-8 bg-slate-200 dark:bg-white/10 z-10"></div>
            <div className="hidden lg:block absolute top-[28px] left-[50%] -ml-[1px] w-[1px] h-8 bg-slate-200 dark:bg-white/10 z-10"></div>
            <div className="hidden lg:block absolute top-[28px] left-[75%] -ml-[1px] w-[1px] h-8 bg-slate-200 dark:bg-white/10 z-10"></div>

            {/* From Input */}
            <div ref={fromRef} className="flex flex-col gap-1.5 relative w-full group/input">
              <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 ml-4 uppercase tracking-wider hidden lg:block"> Leaving From </label>
              <div className="relative group w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10 transition-colors">
                  trip_origin
                </span>
                <input
                  {...register("from", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 chars" },
                  })}
                  onFocus={() => setShowFromDropdown(true)}
                  autoComplete="off"
                  className={`w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-white/5 border-none lg:bg-transparent lg:dark:bg-transparent rounded-2xl lg:rounded-none lg:rounded-l-2xl hover:bg-slate-100 lg:hover:bg-slate-50 dark:hover:bg-white/10 transition-colors dark:text-white font-bold text-lg placeholder-slate-400 outline-none focus:ring-0 ${errors.from ? "bg-red-50 dark:bg-red-500/10 placeholder-red-300" : ""}`}
                  placeholder="Leaving from..."
                  type="text"
                />
              </div>
              {/* Datalist Dropdown */}
              {showFromDropdown && fromValue && <DropdownList field="from" searchValue={fromValue} />}
            </div>

            {/* To Input */}
            <div ref={toRef} className="flex flex-col gap-1.5 relative w-full group/input">
              <label className="text-[13px] font-bold text-slate-500 dark:text-slate-400 ml-4 uppercase tracking-wider hidden lg:block"> Going To </label>
              <div className="relative group w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10 transition-colors">
                  location_on
                </span>
                <input
                  {...register("to", {
                    required: "Required",
                    minLength: { value: 2, message: "Min 2 chars" },
                  })}
                  onFocus={() => setShowToDropdown(true)}
                  autoComplete="off"
                  className={`w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-white/5 border-none lg:bg-transparent lg:dark:bg-transparent rounded-2xl lg:rounded-none hover:bg-slate-100 lg:hover:bg-slate-50 dark:hover:bg-white/10 transition-colors dark:text-white font-bold text-lg placeholder-slate-400 outline-none focus:ring-0 ${errors.from ? "bg-red-50 dark:bg-red-500/10 placeholder-red-300" : ""}`}
                  placeholder="Going to..."
                  type="text"
                />
              </div>
              {/* Datalist Dropdown */}
              {showToDropdown && toValue && <DropdownList field="to" searchValue={toValue} />}
            </div>

            {/* Date Input */}
            <label className="flex flex-col gap-1.5 min-w-0 relative group/input">
              <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 ml-4 uppercase tracking-wider hidden lg:block"> Date </span>
              <div className="relative group min-w-0 w-full">
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <DatePickerInput
                      label=""
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                      disablePast={true}
                      slotProps={{
                        textField: {
                          error: !!errors.date,
                          placeholder: "Today",
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'transparent !important',
                              borderRadius: { xs: '1rem', lg: '0px' },
                              height: '3.5rem',
                              transition: 'all 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgb(248 250 252) !important', // slate-50
                              }
                            },
                            '.dark & .MuiOutlinedInput-root:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiInputBase-input': {
                              paddingLeft: '3rem',
                              paddingRight: '1rem',
                              color: 'inherit',
                              fontSize: '1.125rem',
                              fontWeight: '700',
                            }
                          }
                        }
                      }}
                    />
                  )}
                />
              </div>
            </label>

            {/* Passengers Select */}
            <label className="flex flex-col gap-1.5 min-w-0 relative group/input">
              <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 ml-4 uppercase tracking-wider hidden lg:block"> Passengers </span>
              <div className="relative group min-w-0 w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10">
                  group
                </span>
                <select
                  {...register("passengers", { required: "Required" })}
                  className="w-full h-14 pl-12 pr-8 bg-slate-50 dark:bg-white/5 border-none lg:bg-transparent lg:dark:bg-transparent rounded-2xl lg:rounded-none lg:rounded-r-2xl hover:bg-slate-100 lg:hover:bg-slate-50 dark:hover:bg-white/10 transition-colors dark:text-white font-bold text-lg outline-none focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>1 Passenger</option>
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4+ Passengers</option>
                </select>

              </div>
            </label>

          </div>

          {/* Search Button */}
          <div className="w-full lg:w-auto mt-2 lg:mt-0 flex shrink-0 lg:ml-2">
            <button
              type="submit"
              className="h-[68px] lg:h-[76px] px-8 bg-primary hover:bg-primary-dark text-white rounded-[1.5rem] transition-all flex items-center justify-center gap-2 w-full shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 group/btn"
            >
              <span className="font-extrabold text-lg tracking-wide hidden lg:block">Search</span>
              <span className="font-extrabold text-lg tracking-wide lg:hidden">Search Rides</span>
              <span className="material-symbols-outlined text-[28px] lg:hidden transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
