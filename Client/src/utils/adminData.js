export const STATS = { totalUsers: 4821, activeRides: 312, totalBookings: 9043, revenue: 1847560 };

export const ACTIVITY_DATA = [
    { id: 1, type: "user", text: "Priya Sharma joined the platform", time: "2m ago" },
    { id: 2, type: "ride", text: "New ride: Mumbai → Pune by Rahul Verma", time: "8m ago" },
    { id: 3, type: "booking", text: "Booking #8821 confirmed by Ankit Joshi", time: "15m ago" },
    { id: 4, type: "user", text: "Meena Patel completed KYC verification", time: "22m ago" },
    { id: 5, type: "ride", text: "Ride #441 cancelled by driver", time: "34m ago" },
    { id: 6, type: "booking", text: "Booking #8820 payment received ₹850", time: "45m ago" },
    { id: 7, type: "user", text: "Karan Mehta joined the platform", time: "1h ago" },
    { id: 8, type: "ride", text: "New ride: Delhi → Agra by Suresh Kumar", time: "1h ago" },
];

export const USERS_DATA = [
    { id: "u1", name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", verified: true, bio: "Frequent traveler between Mumbai and Pune.", joined: "Jan 12, 2024" },
    { id: "u2", name: "Rahul Verma", email: "rahul@email.com", phone: "+91 87654 32109", verified: false, bio: "Daily commuter, loves carpooling to save fuel.", joined: "Feb 3, 2024" },
    { id: "u3", name: "Ankit Joshi", email: "ankit@email.com", phone: "+91 76543 21098", verified: true, bio: "Weekend traveler and tech enthusiast.", joined: "Mar 5, 2024" },
    { id: "u4", name: "Meena Patel", email: "meena@email.com", phone: "+91 65432 10987", verified: false, bio: "Looking for safe and affordable rides.", joined: "Apr 8, 2024" },
    { id: "u5", name: "Karan Mehta", email: "karan@email.com", phone: "+91 54321 09876", verified: true, bio: "Regular driver on the Delhi–Jaipur route.", joined: "May 1, 2024" },
    { id: "u6", name: "Sneha Iyer", email: "sneha@email.com", phone: "+91 43210 98765", verified: true, bio: "IT professional commuting daily.", joined: "May 15, 2024" },
];

export const RIDES_DATA = [
    { id: "r1", origin: "Mumbai", destination: "Pune", departure: "2024-06-10 07:00", arrival: "2024-06-10 10:30", seats: 3, price: 450, status: "scheduled", driver: "Rahul Verma", license: "MH-12-AB-1234", car: "Honda City", carNum: "MH12AB1234", driverVerified: false },
    { id: "r2", origin: "Delhi", destination: "Agra", departure: "2024-06-10 08:00", arrival: "2024-06-10 11:00", seats: 2, price: 600, status: "ongoing", driver: "Karan Mehta", license: "DL-01-CD-5678", car: "Maruti Suzuki Ertiga", carNum: "DL01CD5678", driverVerified: true },
    { id: "r3", origin: "Bangalore", destination: "Mysore", departure: "2024-06-09 09:00", arrival: "2024-06-09 12:00", seats: 0, price: 350, status: "completed", driver: "Sneha Iyer", license: "KA-05-EF-9012", car: "Toyota Innova", carNum: "KA05EF9012", driverVerified: true },
    { id: "r4", origin: "Chennai", destination: "Pondicherry", departure: "2024-06-08 06:00", arrival: "2024-06-08 09:30", seats: 0, price: 500, status: "cancelled", driver: "Ankit Joshi", license: "TN-09-GH-3456", car: "Hyundai Creta", carNum: "TN09GH3456", driverVerified: false },
    { id: "r5", origin: "Hyderabad", destination: "Vijayawada", departure: "2024-06-11 10:00", arrival: "2024-06-11 15:00", seats: 4, price: 700, status: "scheduled", driver: "Priya Sharma", license: "TS-11-IJ-7890", car: "Kia Seltos", carNum: "TS11IJ7890", driverVerified: true },
];

export const BOOKINGS_DATA = [
    { id: "b1", rideId: "r1", passenger: "Meena Patel", status: "confirmed", price: 450, date: "2024-06-10" },
    { id: "b2", rideId: "r2", passenger: "Priya Sharma", status: "completed", price: 600, date: "2024-06-10" },
    { id: "b3", rideId: "r3", passenger: "Ankit Joshi", status: "completed", price: 350, date: "2024-06-09" },
    { id: "b4", rideId: "r4", passenger: "Rahul Verma", status: "cancelled", price: 500, date: "2024-06-08" },
    { id: "b5", rideId: "r1", passenger: "Karan Mehta", status: "pending", price: 450, date: "2024-06-10" },
    { id: "b6", rideId: "r5", passenger: "Sneha Iyer", status: "confirmed", price: 700, date: "2024-06-11" },
    { id: "b7", rideId: "r3", passenger: "Meena Patel", status: "completed", price: 350, date: "2024-06-09" },
];

export const REVIEWS_DATA = [
    { id: "rv1", reviewer: "Priya Sharma", rating: 5, comment: "Excellent ride, driver was very professional and the car was clean.", ride: "r3", hidden: false },
    { id: "rv2", reviewer: "Ankit Joshi", rating: 4, comment: "Good experience overall, slightly delayed departure but comfortable.", ride: "r2", hidden: false },
    { id: "rv3", reviewer: "Meena Patel", rating: 2, comment: "Driver was rude and took wrong route. Not recommended.", ride: "r4", hidden: false },
    { id: "rv4", reviewer: "Karan Mehta", rating: 5, comment: "Perfect journey, arrived on time. Will book again!", ride: "r1", hidden: true },
    { id: "rv5", reviewer: "Sneha Iyer", rating: 3, comment: "Average experience. Car could be cleaner.", ride: "r5", hidden: false },
];

export const CITIES_DATA = [
    { id: "c1", name: "Mumbai", state: "Maharashtra", active: true },
    { id: "c2", name: "Pune", state: "Maharashtra", active: true },
    { id: "c3", name: "Delhi", state: "Delhi", active: true },
    { id: "c4", name: "Bangalore", state: "Karnataka", active: true },
    { id: "c5", name: "Hyderabad", state: "Telangana", active: true },
    { id: "c6", name: "Chennai", state: "Tamil Nadu", active: false },
];
