import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1 = enter email, 2 = enter new password
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCheckEmail = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/check-email", { email });
            setMessage(res.data.message || "Email verified. Please enter your new password.");
            setStep(2);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Email not found"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!newPassword || newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword,
            });

            setMessage(res.data.message || "Password updated successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {step === 1 ? "Reset Password" : "Enter New Password"}
                </h1>

                {step === 1 ? (
                    <form onSubmit={handleCheckEmail} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {message && (
                            <p className="text-green-600 text-sm">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Checking..." : "Verify Email"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {message && (
                            <p className="text-green-600 text-sm">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;