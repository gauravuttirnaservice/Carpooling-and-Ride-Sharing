import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePickerInput from "../../DatePicker/DatePicker";

export default function SearchBar({ defaultValues = {} }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: defaultValues.from || "Nashik",
      to: defaultValues.to || "Mumbai",
      date: defaultValues.date || "2023-10-24",
      passengers: defaultValues.passengers || "1",
    },
  });

  const onSubmit = (data) => {
    console.log("Search data:", data);
    // Navigate to listings with search params
    navigate(
      `/listings?from=${data.from}&to=${data.to}&date=${data.date}&passengers=${data.passengers}`,
    );
  };

  return (
    <div className="bg-white dark:bg-[#1a2e22] rounded-xl p-4 border border-[#e7f3eb] dark:border-white/5 mb-6 mt-14">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
            {/* From Input */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                From
              </span>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">
                  trip_origin
                </span>
                <input
                  {...register("from", {
                    required: "Departure city is required",
                    minLength: {
                      value: 2,
                      message: "City name must be at least 2 characters",
                    },
                  })}
                  className={`w-full h-12 pl-10 pr-4 bg-background-light dark:bg-background-dark border ${errors.from
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:ring-primary"
                    } rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all dark:text-white font-medium`}
                  placeholder="City"
                  type="text"
                />
              </div>
              {errors.from && (
                <span className="text-xs text-red-500 ml-1">
                  {errors.from.message}
                </span>
              )}
            </label>

            {/* To Input */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                To
              </span>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">
                  location_on
                </span>
                <input
                  {...register("to", {
                    required: "Destination city is required",
                    minLength: {
                      value: 2,
                      message: "City name must be at least 2 characters",
                    },
                  })}
                  className={`w-full h-12 pl-10 pr-4 bg-background-light dark:bg-background-dark border ${errors.to
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-200 dark:border-slate-700 focus:ring-primary"
                    } rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all dark:text-white font-medium`}
                  placeholder="City"
                  type="text"
                />
              </div>
              {errors.to && (
                <span className="text-xs text-red-500 ml-1">
                  {errors.to.message}
                </span>
              )}
            </label>

            {/* Date Input */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Date
              </span>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary z-10 pointer-events-none">
                  calendar_month
                </span>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <DatePickerInput
                      label=""
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full h-12 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg transition-all"
                      disablePast={true}
                      slotProps={{
                        textField: {
                          error: !!errors.date,
                          placeholder: "Select Date",
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '0.5rem',
                              height: '3rem',
                              backgroundColor: 'transparent'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiInputBase-input': {
                              paddingLeft: '2.5rem', /* 40px for the icon */
                              paddingRight: '1rem',
                              color: 'inherit',
                            }
                          }
                        }
                      }}
                    />
                  )}
                />
              </div>
              {errors.date && (
                <span className="text-xs text-red-500 ml-1">
                  {errors.date.message}
                </span>
              )}
            </label>

            {/* Passengers Select */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Passengers
              </span>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">
                  group
                </span>
                <select
                  {...register("passengers", { required: true })}
                  className="w-full h-12 pl-10 pr-10 bg-background-light dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white font-medium appearance-none"
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4+ Passengers</option>
                </select>

              </div>
            </label>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="h-12 px-8 bg-primary hover:bg-green-400 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 w-full lg:w-auto"
          >
            <span className="material-symbols-outlined">search</span>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
