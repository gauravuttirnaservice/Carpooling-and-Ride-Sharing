import { forwardRef } from "react";

const DriverDetailsForm = forwardRef(
  ({ register, errors, isDriver, validateFileSize, validateFileType }, ref) => {
    return (
      <section
        ref={ref}
        className="space-y-6 pt-6 border-t border-dashed border-gray-200 animate-in fade-in duration-500"
      >
        <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-6 flex items-center gap-2">
          <span className="w-8 h-px bg-orange-200"></span> Driver & Vehicle
          Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* License Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Driving License Number
            </label>
            <input
              type="text"
              {...register("licenseNumber", {
                required: isDriver ? "License number is required" : false,
                pattern: {
                  value: /^[A-Z]{2}[-]?[0-9]{13,14}$/i,
                  message: "Invalid format (e.g., DL-1234567890123)",
                },
              })}
              placeholder="DL-1234567890123"
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.licenseNumber ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
            />
            {errors.licenseNumber && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>

          {/* License File */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload License Copy
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("licenseFile", {
                required: isDriver ? "License copy is required" : false,
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    validateFileSize(files[0], 5) ||
                    "File must be less than 5MB",
                  fileType: (files) =>
                    !files[0] ||
                    validateFileType(files[0], ["pdf", "jpg", "jpeg", "png"]) ||
                    "Only PDF, JPG, PNG allowed",
                },
              })}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 file:font-semibold file:cursor-pointer hover:file:bg-orange-100 transition-all"
            />
            {errors.licenseFile && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.licenseFile.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              {...register("vehicleType", {
                required: isDriver ? "Vehicle type is required" : false,
              })}
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.vehicleType ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer`}
            >
              <option value="">Select vehicle type</option>
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Bike">Bike</option>
            </select>
            {errors.vehicleType && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.vehicleType.message}
              </p>
            )}
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand & Model
            </label>
            <input
              type="text"
              {...register("vehicleModel", {
                required: isDriver ? "Vehicle model is required" : false,
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
              })}
              placeholder="Toyota Camry 2022"
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.vehicleModel ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
            />
            {errors.vehicleModel && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.vehicleModel.message}
              </p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              {...register("registrationNumber", {
                required: isDriver ? "Registration number is required" : false,
                pattern: {
                  value:
                    /^[A-Z]{2}[-]?[0-9]{1,2}[-]?[A-Z]{1,2}[-]?[0-9]{1,4}$/i,
                  message: "Invalid format (e.g., MH-12-AB-1234)",
                },
              })}
              placeholder="MH-12-AB-1234"
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.registrationNumber ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
            />
            {errors.registrationNumber && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.registrationNumber.message}
              </p>
            )}
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seating Capacity
            </label>
            <input
              type="number"
              {...register("seatingCapacity", {
                required: isDriver ? "Seating capacity is required" : false,
                min: { value: 1, message: "Minimum 1 seat" },
                max: { value: 20, message: "Maximum 20 seats" },
                valueAsNumber: true,
              })}
              placeholder="4"
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.seatingCapacity ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
            />
            {errors.seatingCapacity && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.seatingCapacity.message}
              </p>
            )}
          </div>

          {/* RC Book */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload RC Book
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("rcBook", {
                required: isDriver ? "RC Book is required" : false,
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    validateFileSize(files[0], 5) ||
                    "File must be less than 5MB",
                  fileType: (files) =>
                    !files[0] ||
                    validateFileType(files[0], ["pdf", "jpg", "jpeg", "png"]) ||
                    "Only PDF, JPG, PNG allowed",
                },
              })}
              className="text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:font-semibold file:cursor-pointer hover:file:bg-gray-200 transition-all"
            />
            {errors.rcBook && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.rcBook.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          {/* Insurance */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Insurance
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("insurance", {
                required: isDriver ? "Insurance is required" : false,
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    validateFileSize(files[0], 5) ||
                    "File must be less than 5MB",
                  fileType: (files) =>
                    !files[0] ||
                    validateFileType(files[0], ["pdf", "jpg", "jpeg", "png"]) ||
                    "Only PDF, JPG, PNG allowed",
                },
              })}
              className="text-sm text-gray-500 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:font-semibold file:cursor-pointer hover:file:bg-gray-200 transition-all"
            />
            {errors.insurance && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.insurance.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          {/* Bank Account */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bank Account Number
            </label>
            <input
              type="text"
              {...register("bankAccount", {
                required: isDriver ? "Bank account is required" : false,
                pattern: {
                  value: /^[0-9]{9,18}$/,
                  message: "Invalid account number (9-18 digits)",
                },
              })}
              placeholder="123456789012"
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.bankAccount ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
            />
            {errors.bankAccount && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.bankAccount.message}
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              IFSC Code
            </label>
            <input
              type="text"
              {...register("ifscCode", {
                required: isDriver ? "IFSC code is required" : false,
                maxLength: { value: 11, message: "Invalid IFSC (e.g., SBIN0001234)" },
                pattern: {
                  value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                  message: "Invalid IFSC (e.g., SBIN0001234)",
                },
              })}
              placeholder="SBIN0001234"
              className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.ifscCode ? "border-red-500" : "border-gray-200"
                } rounded-xl text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all`}
            />
            {errors.ifscCode && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">
                {errors.ifscCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-orange-500 text-xl">
              info
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-900 mb-1">
                Driver Verification
              </h3>
              <p className="text-xs text-orange-700 leading-relaxed">
                Documents will be verified within 24-48 hours. You'll receive
                confirmation once approved.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

DriverDetailsForm.displayName = "DriverDetailsForm";

export default DriverDetailsForm;
