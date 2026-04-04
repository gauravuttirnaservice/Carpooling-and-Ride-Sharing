import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { useBookingContext } from "../../../contexts/BookingContext";

const BookingCard = ({ ride }) => {
  const { setBookingData } = useBookingContext();
  const [passengers, setPassengers] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  if (!ride) return null;

  const pricePerSeat = Number(ride.pricePerSeat) || 0;
  const availableSeats = Number(ride.availableSeats) || 0;
  const serviceFee = 18;

  const handleIncrement = () => {
    if (passengers < availableSeats) {
      setPassengers(passengers + 1);
    }
  };

  const handleDecrement = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  const initPay = (order, bookingId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'RideShare Booking',
      description: 'Secure seat booking payment',
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: bookingId
          };

          const verifyRes = await axiosInstance.post('/bookings/verify', verifyData);

          if (verifyRes.data.success) {
            toast.success("Payment successful! Your seat is confirmed.");
            navigate('/my-ride');
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast.error("An error occurred while verifying payment.");
        } finally {
          setIsBooking(false);
        }
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled.");
          setIsBooking(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const total = pricePerSeat * passengers + serviceFee;

  const handleBook = async () => {
    if (!ride || !ride.id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to book a ride", { position: "top-center" });
      navigate("/login", { state: { from: window.location.pathname + window.location.search } });
      return;
    }

    setIsBooking(true);

    try {
      const response = await axiosInstance.post('/bookings', {
        rideId: ride.id,
        seatsBooked: passengers,
        totalPrice: total
      });

      if (response.data.success) {
        const { booking, razorpayOrder } = response.data.data;
        setBookingData({ ride, passengers, total, booking });
        initPay(razorpayOrder, booking.id);
      }
    } catch (error) {
      console.error('Error initializing checkout:', error);
      const errorMsg = error.response?.data?.message || 'Failed to initiate booking';
      toast.error(errorMsg, { position: "top-center" });
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#15241b] rounded-[2rem] p-7 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 sticky top-28">

      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">₹</span>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {pricePerSeat}
            </p>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-wide uppercase mt-1">per seat</p>
        </div>

        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-primary text-sm font-bold bg-emerald-50 dark:bg-primary/10 px-3 py-1.5 rounded-xl">
            <span className="material-symbols-outlined !text-[16px]">
              event_seat
            </span>
            {availableSeats} left
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-6"></div>

      <div className="mb-6">
        <label className="block text-sm font-bold tracking-wide uppercase text-slate-700 dark:text-slate-300 mb-3">
          Passengers
        </label>
        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1a2e22] rounded-2xl p-2.5 border border-slate-100 dark:border-white/5">
          <button
            onClick={handleDecrement}
            disabled={passengers <= 1}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#15241b] text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
          >
            <span className="material-symbols-outlined font-black">remove</span>
          </button>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {passengers}
          </span>
          <button
            onClick={handleIncrement}
            disabled={passengers >= availableSeats}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#15241b] text-primary shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
          >
            <span className="material-symbols-outlined font-black">add</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 text-sm px-1">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Service fee</span>
        <span className="font-bold text-slate-900 dark:text-white">
          ₹{serviceFee}
        </span>
      </div>

      <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-6"></div>

      <div className="flex justify-between items-center mb-8 px-1">
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Total amount
        </span>
        <span className="text-3xl font-black text-primary tracking-tighter">₹{total}</span>
      </div>

      <button
        onClick={handleBook}
        disabled={availableSeats === 0 || isBooking}
        className={`w-full h-[60px] relative overflow-hidden text-white font-extrabold text-lg rounded-[1.25rem] shadow-xl shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group ${isBooking || availableSeats === 0
            ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
            : 'bg-primary hover:bg-primary-dark hover:shadow-primary/40 focus:ring-4 focus:ring-primary/20'
          }`}
      >
        {/* Subtle shine effect on hover */}
        {!(isBooking || availableSeats === 0) && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
        )}

        <span className="relative z-10 flex items-center justify-center gap-2">
          {isBooking ? (
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : availableSeats === 0 ? "Sold Out" : "Confirm & Pay"}

          {availableSeats !== 0 && !isBooking && (
            <span className="material-symbols-outlined !font-black transition-transform group-hover:translate-x-1">arrow_forward</span>
          )}
        </span>
      </button>

      <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-4">
        100% Secure Payment Guarantee
      </p>
    </div>
  );
};

export default BookingCard;
