import { useForm, useWatch, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCityContext } from '../../../contexts/CityContext';
import { useSearchContext } from '../../../contexts/SearchContext';
import { Autocomplete, TextField } from "@mui/material";
import { useMemo } from "react";
import DatePickerInput from "../../DatePicker/DatePicker";

const SearchForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: '',
      to: '',
      date: ''
    }
  });

  const { popularCities } = useCityContext();
  const { setSearchParams, setHasSearched } = useSearchContext();

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

  const onSubmit = (data) => {
    setSearchParams({
      from: data.from,
      to: data.to,
      date: data.date,
      passengers: "1"
    });
    setHasSearched(true);
    navigate("/find-ride");
  };

  const getFilteredCities = (searchTerm) => {
    if (!searchTerm) return popularCities;
    const term = searchTerm.toLowerCase();
    const filtered = popularCities.map(cityObj => {
      if (cityObj.city.toLowerCase().includes(term)) {
        return cityObj;
      }
      const matchingPoints = cityObj.points.filter(point =>
        point.toLowerCase().includes(term)
      );
      if (matchingPoints.length > 0) {
        return {
          ...cityObj,
          points: matchingPoints
        };
      }
      return null;
    }).filter(Boolean);
    return filtered;
  };

  const filteredFromCities = useMemo(() => {
    return getFilteredCities(fromValue);
  }, [fromValue, popularCities]);

  const filteredToCities = useMemo(() => {
    return getFilteredCities(toValue);
  }, [toValue, popularCities]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row w-full items-stretch lg:items-center bg-white p-2 lg:p-3 rounded-3xl lg:rounded-full shadow-2xl relative z-[100]"
    >
      {/* From Input */}
      <div
        ref={fromRef}
        className="flex flex-1 flex-col px-4 py-2 justify-center relative group min-w-[200px]"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[24px] text-slate-300">
            radio_button_unchecked
          </span>
          <div className="flex flex-col w-full">
            <label
              htmlFor="from"
              className="text-[11px] font-bold text-slate-500 mb-0.5 uppercase tracking-wide"
            >
              FROM:
            </label>
            <input
              id="from"
              autoComplete="off"
              type="text"
              {...register('from', {
                required: 'Departure is required',
                minLength: { value: 2, message: 'Must be at least 2 chars' },
              })}
              onFocus={() => setShowFromDropdown(true)}
              className="w-full bg-transparent border-none p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0 text-base font-medium truncate"
              placeholder="City or location..."
            />
          </div>
        </div>

        {errors.from && (
          <p className="text-red-500 text-[10px] font-bold mt-1 absolute -bottom-4 left-10">{errors.from.message}</p>
        )}

        {/* Custom Dropdown */}
        {showFromDropdown && fromValue && filteredFromCities.length > 0 && (
          <div className="absolute top-full left-0 w-full lg:w-[120%] bg-white shadow-xl rounded-2xl mt-2 z-50 max-h-72 overflow-y-auto border border-slate-100 py-2">
            {filteredFromCities.map((cityObj) => (
              <div key={cityObj.city} className="py-1">
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue("from", cityObj.city, { shouldValidate: true });
                    setShowFromDropdown(false);
                  }}
                  className="px-5 py-2 text-xs font-bold uppercase text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined !text-[16px]">location_city</span>
                  {cityObj.city}
                </div>
                {cityObj.points.map((point) => {
                  const fullValue = `${point}, ${cityObj.city}`;
                  return (
                    <div
                      key={fullValue}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setValue("from", fullValue, { shouldValidate: true });
                        setShowFromDropdown(false);
                      }}
                      className="px-8 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {point}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block w-px h-10 bg-slate-200"></div>

      {/* To Input */}
      <div
        ref={toRef}
        className="flex flex-1 flex-col px-4 py-2 justify-center relative group min-w-[200px]"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[24px] text-slate-300">
            location_on
          </span>
          <div className="flex flex-col w-full">
            <label
              htmlFor="to"
              className="text-[11px] font-bold text-slate-500 mb-0.5 uppercase tracking-wide"
            >
              TO:
            </label>
            <input
              id="to"
              autoComplete="off"
              type="text"
              {...register('to', {
                required: 'Destination is required',
                minLength: { value: 2, message: 'Must be at least 2 chars' },
              })}
              onFocus={() => setShowToDropdown(true)}
              className="w-full bg-transparent border-none p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0 text-base font-medium truncate"
              placeholder="City or location..."
            />
          </div>
        </div>

        {errors.to && (
          <p className="text-red-500 text-[10px] font-bold mt-1 absolute -bottom-4 left-10">{errors.to.message}</p>
        )}

        {/* Custom Dropdown */}
        {showToDropdown && toValue && filteredToCities.length > 0 && (
          <div className="absolute top-full left-0 w-full lg:w-[120%] bg-white shadow-xl rounded-2xl mt-2 z-50 max-h-72 overflow-y-auto border border-slate-100 py-2">
            {filteredToCities.map((cityObj) => (
              <div key={cityObj.city} className="py-1">
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue("to", cityObj.city, { shouldValidate: true });
                    setShowToDropdown(false);
                  }}
                  className="px-5 py-2 text-xs font-bold uppercase text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined !text-[16px]">location_city</span>
                  {cityObj.city}
                </div>
                {cityObj.points.map((point) => {
                  const fullValue = `${point}, ${cityObj.city}`;
                  return (
                    <div
                      key={fullValue}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setValue("to", fullValue, { shouldValidate: true });
                        setShowToDropdown(false);
                      }}
                      className="px-8 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {point}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block w-px h-10 bg-slate-200"></div>

      {/* Date Input */}
      <div className="flex flex-1 flex-col px-4 py-2 justify-center relative group min-w-[180px]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined !text-[24px] text-slate-300">
            event
          </span>
          <div className="flex flex-col w-full">
            <label
              htmlFor="date"
              className="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
            >
              DATE:
            </label>
            <Controller
              name="date"
              control={control}
              rules={{
                required: 'Date is required',
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return (
                    selectedDate >= today || 'Date cannot be in the past'
                  );
                },
              }}
              render={({ field }) => (
                <div className="w-full relative top-[2px]">
                  <DatePickerInput
                    label=""
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                    disablePast={true}
                    slotProps={{
                      textField: {
                        error: !!errors.date,
                        placeholder: "MM/DD/YYYY",
                        variant: "standard",
                        InputProps: { disableUnderline: true },
                        sx: {
                          '& .MuiInputBase-root': { height: 'auto', padding: 0, margin: 0 },

                          '& .MuiInputBase-input': {
                            padding: '0px',
                            fontSize: '1rem',
                            fontWeight: 500,
                            lineHeight: 1.25,
                            color: '#1e293b',
                            '&::placeholder': { color: '#94a3b8', opacity: 1 }
                          }
                        }
                      }
                    }}
                  />
                </div>
              )}
            />
          </div>
        </div>

        {errors.date && (
          <p className="text-red-500 text-[10px] font-bold mt-1 absolute -bottom-4 left-10">{errors.date.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-4 lg:mt-0 p-5 ">
        <button
          type="submit"
          className="flex w-full lg:w-auto h-14 items-center justify-center gap-2 rounded-full bg-[#1da046] px-6 text-white font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined !text-[24px]">search</span>
          <span className="whitespace-nowrap">SEARCH RIDES</span>
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
