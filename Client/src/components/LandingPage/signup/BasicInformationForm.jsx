import { useState } from "react";
import { Controller } from "react-hook-form";
import DatePickerInput from "../../DatePicker/DatePicker";
import { IdCard, AlertCircle, ChevronDown, CloudUpload, User, Mail, Phone, Lock, Calendar, Navigation, Camera, X } from "lucide-react";

export default function BasicInformationForm({
  register,
  errors,
  control,
  password,
  validateAge,
  validateFileSize,
  validateFileType,
}) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateFileType(file, ["jpg", "jpeg", "png", "webp"])) {
        return; // Let react-hook-form handle the error display
      }
      if (!validateFileSize(file, 5)) {
        return; // Let react-hook-form handle the error display
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const removeImage = (e) => {
    e.preventDefault(); // Prevent form submission
    setPreviewImage(null);
    // We also need to clear the react-hook-form value, but since we are handling this
    // via register, the user will just submit without it, or we can just leave it as null preview
    // To properly reset the input field value in react-hook-form, we'd need setValue, 
    // but clearing the preview is enough for visual feedback
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center">
          <IdCard className="text-[#10b981] w-5 h-5" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
          Personal Information
        </h2>
      </div>

      {/* Profile Picture Upload - Centered at the top */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="relative group cursor-pointer">
          <div className={`w-32 h-32 rounded-full border-4 ${errors.profilePicture ? "border-red-500" : "border-slate-100 group-hover:border-[#10b981]/50"} overflow-hidden bg-slate-50 flex items-center justify-center shadow-lg transition-all relative z-10`}>
            {previewImage ? (
              <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-300" strokeWidth={1.5} />
            )}
          </div>

          {!previewImage ? (
            <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Upload</span>
            </div>
          ) : (
            <button
              onClick={removeImage}
              className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600 transition-colors z-30 shadow-md"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            {...register("profilePicture", {
              required: "Profile photo is required",
              onChange: handleImageChange,
              validate: {
                fileSize: (value) =>
                  !value || !value[0] || validateFileSize(value[0], 5) || "File size must be under 5MB",
                fileType: (value) =>
                  !value || !value[0] || validateFileType(value[0], ["jpg", "jpeg", "png", "webp"]) || "Only JPG, PNG and WEBP allowed"
              }
            })}
          />
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-sm font-bold text-slate-800">Profile Photo</h3>


          {errors.profilePicture && (
            <p className="mt-2 text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
              {errors.profilePicture.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
        {/* Username */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10b981] transition-colors z-10" />
            <input
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Username must not exceed 20 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_ ]+$/,
                  message: "Only letters, numbers, spaces, and underscores allowed",
                },
              })}
              placeholder="John Doe"
              className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 ${errors.username ? "border-red-500" : "border-slate-200"
                } rounded-2xl outline-none text-base text-[#1A1A1A] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 hover:border-slate-300 transition-all font-medium placeholder:text-slate-400 relative z-0`}
            />
          </div>
          {errors.username && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10b981] transition-colors z-10" />
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="john@example.com"
              className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 ${errors.email ? "border-red-500" : "border-slate-200"
                } rounded-2xl outline-none text-base text-[#1A1A1A] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 hover:border-slate-300 transition-all font-medium placeholder:text-slate-400 relative z-0`}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Phone Number
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10b981] transition-colors z-10" />
            <input
              maxLength={10}
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number (10 digits)",
                },
              })}
              placeholder="+91 888 888 8888"
              className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 ${errors.phone ? "border-red-500" : "border-slate-200"
                } rounded-2xl outline-none text-base text-[#1A1A1A] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 hover:border-slate-300 transition-all font-medium placeholder:text-slate-400 relative z-0`}
            />
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10b981] transition-colors z-10" />
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Must include uppercase, lowercase, number & special char",
                },
              })}
              placeholder="••••••••"
              className={`w-full pl-12 pr-4 py-3.5 bg-white border-2 ${errors.password ? "border-red-500" : "border-slate-200"
                } rounded-2xl outline-none text-base text-[#1A1A1A] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 hover:border-slate-300 transition-all font-medium placeholder:text-slate-400 relative z-0`}
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Date of Birth
          </label>
          <div className="relative group">

            <Controller
              name="dob"
              control={control}
              rules={{
                required: "Date of birth is required",
                validate: (value) =>
                  validateAge(value) || "You must be at least 18 years old",
              }}
              render={({ field }) => (
                <DatePickerInput
                  label=""
                  value={field.value}
                  onChange={field.onChange}
                  className={`w-full bg-white border-2 hover:border-slate-300 focus-within:border-[#10b981] focus-within:ring-4 focus-within:ring-[#10b981]/10 ${errors.dob ? "border-red-500" : "border-slate-200"} rounded-2xl transition-all relative z-0`}
                  slotProps={{
                    textField: {
                      error: !!errors.dob,
                      placeholder: "Select Date of Birth",
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
                          color: '#1A1A1A'
                        }
                      }
                    }
                  }}
                />
              )}
            />
          </div>
          {errors.dob && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.dob.message}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Gender
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#10b981] transition-colors z-10" />
            <select
              {...register("gender", {
                required: "Gender is required",
              })}
              className={`w-full pl-12 pr-10 py-3.5 bg-white border-2 ${errors.gender ? "border-red-500" : "border-slate-200"
                } rounded-2xl outline-none text-base text-[#1A1A1A] appearance-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 hover:border-slate-300 transition-all font-medium cursor-pointer flex items-center relative z-0`}
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" strokeWidth={2.5} />
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2.5">
            Residential Address
          </label>
          <div className="relative group">
            <Navigation className="absolute left-4 top-5 w-5 h-5 text-slate-400 group-focus-within:text-[#10b981] transition-colors z-10" />
            <textarea
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
              rows="3"
              placeholder="E.g., 123 Main Street, Apt 4B, City, Country"
              className={`w-full pl-12 pr-4 pt-4 pb-3.5 bg-white border-2 ${errors.address ? "border-red-500" : "border-slate-200"
                } rounded-2xl outline-none text-base text-[#1A1A1A] focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 hover:border-slate-300 transition-all font-medium placeholder:text-slate-400 resize-none relative z-0`}
            ></textarea>
          </div>
          {errors.address && (
            <p className="mt-2 text-sm text-red-500 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
              {errors.address.message}
            </p>
          )}
        </div>

        {/* ID Proof */}


      </div>
    </section>
  );
}
