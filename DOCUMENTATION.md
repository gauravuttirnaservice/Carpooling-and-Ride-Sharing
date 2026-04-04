# Carpooling and Ride Sharing System - Project Documentation

## 1. Introduction
Welcome to the Carpooling and Ride Sharing project! This documentation is designed to help you quickly understand the flow, architecture, and components of this system. Whether you are adding new features, debugging an issue, or presenting this project, this guide covers everything you need to know.

## 2. Technology Stack
- **Frontend**: React.js (built with Vite), Tailwind CSS for styling, React Router for navigation, Axios for API calls.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL with Sequelize as the Object-Relational Mapper (ORM).
- **Authentication**: JSON Web Tokens (JWT) for secure login and session management.
- **Payment Gateway**: Razorpay integration for simulated booking transactions.

## 3. Project Structure
The project is divided into two main directories: `Client` (Frontend) and `backend` (Backend API).

```text
Carpooling and Ride Sharing/
│
├── Client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable building blocks (buttons, navbars, forms)
│   │   ├── pages/          # Main views connecting multiple components
│   │   ├── assets/         # Images, icons, and static files
│   │   └── App.jsx         # Main application component & routes
│
└── backend/                # Node/Express Backend Application
    ├── config/             # Database connection setups
    ├── models/             # Sequelize database schemas (User, Ride, etc.)
    ├── controllers/        # Business logic handler functions
    ├── routes/             # API endpoint definitions mapped to controllers
    ├── middleware/         # Auth verification and file upload setup
    └── index.js            # Main server entry point
```

## 4. Backend Architecture
The backend follows the **MVC (Model-View-Controller)** pattern conceptually, but without the "View" since it's a pure API serving JSON to the React frontend.

### A. Models (Database Entities)
Located in `backend/models/`. These define the structure of our PostgreSQL database tables:
- **User.js**: Stores details of all users (passengers and drivers) like name, email, password (hashed for security), and profile information.
- **Ride.js**: Stores details about offered rides, like origin, destination, date, time, available seats, and price. A ride belongs to a driver (User).
- **Booking.js**: Records when a passenger books a seat in a ride. It tracks the payment status (e.g., via Razorpay) and booking status (confirmed, cancelled).
- **Review.js**: Allows passengers to rate and review drivers after a trip.
- **City.js**: Stores geographical data for filtering searches.

### B. Routes (API Endpoints)
Located in `backend/routes/`. These act as the entry points for the React frontend to communicate with the server:
- `authRoutes.js`: Handles user registration, login, and fetching user profiles.
- `rideRoutes.js`: Endpoints to create (offer) rides, find rides, and fetch specific ride details.
- `bookingRoutes.js`: Endpoints to book a seat, cancel bookings, and verify payments.
- `reviewRoutes.js`: Endpoints to submit and read reviews.

### C. Controllers (Business Logic)
Located in `backend/controllers/`. When an API route is triggered by the frontend, the corresponding controller function is executed. It communicates with the Model to access or modify the database and returns JSON data (or an error) to the client.

## 5. Frontend Architecture
The frontend uses **React.js** to build an interactive Single Page Application (SPA).

### A. Core Pages
Located in `Client/src/pages/`:
- **HomePage.jsx**: The landing page.
- **LoginPage.jsx / SignUpPage.jsx**: Authentication screens.

### B. Dashboards (The Core Application)
Once a user logs in, they access different dashboards depending on what they want to do:

**User (Passenger) Dashboard** (`Client/src/pages/userdashboardpages/`):
- **FindRidePage.jsx**: Users can search for available rides specifying start and end locations.
- **RideDetailsPage.jsx**: View details of a specific ride, including the driver's info, vehicle details, and price.
- **BookingConfirmationPage.jsx**: Review details and proceed to payment via Razorpay integration.
- **MyRidesPage.jsx**: View past and upcoming booked rides, as well as cancellation options.
- **UserPaymentHistoryPage.jsx**: Review transaction history for all bookings.

**Driver Dashboard** (`Client/src/pages/driverdashboardpages/`):
- **OfferRidePage.jsx**: A form where drivers can publish a new ride, specifying route, time, and seat availability.
- **ScheduleRidesPage.jsx**: Dashboard to view the rides the driver has scheduled and see who booked them.
- **PaymentHistoryPage.jsx**: Track earnings from completed and booked rides.

### C. Components
Located in `Client/src/components/`, these are smaller reusable UI pieces:
- `DriverNavbar.jsx` / `UserNavbar.jsx`: Dedicated navigation menus.
- `ProfileCard.jsx`: Displays and updates user information on the dashboard.
- Search forms, ride display cards, review components, and modal popups.

## 6. Understanding the Typical User Flow

### Flow 1: Offering a Ride (Driver perspective)
1. **Login**: The user logs into the system.
2. **Dashboard**: Navigates to the Driver Dashboard.
3. **Offer Ride**: Fills out the `OfferRidePage` form (Origin, Destination, Date, Time, Price, Vehicle Details).
4. **Backend Processing**: The frontend sends a `POST` request to `api/rides`, which uses the ride controller to save the details into the **Ride** model in PostgreSQL.
5. **Success**: The ride becomes visible in the database to users searching for that route.

### Flow 2: Booking a Ride (Passenger perspective)
1. **Search**: Passenger enters origin and destination on the `FindRidePage`.
2. **Select Ride**: Clicks on a suitable ride to view details (which calls the backend to get specific ride & driver info).
3. **Book**: Clicks 'Book Seat' on `RideDetailsPage`.
4. **Payment Processing**:
   - The frontend calls the backend to create a Razorpay order.
   - Razorpay's checkout widget opens.
   - Upon successful payment, details are sent to the backend `verifyPayment` route.
5. **Confirmation**: The backend creates a new entry in the **Booking** model and updates the available seats in the **Ride** model. The user is redirected to the confirmation page.

## 7. How to Run the Project Locally
Ensure you have Node.js and PostgreSQL installed.

1. **Database Setup**: Ensure PostgreSQL is running and create an empty database.
2. **Backend**:
   - Navigate to the `backend/` folder in your terminal.
   - Run `npm install` to install dependencies.
   - Configure your `.env` file (Database credentials, JWT Secret, Razorpay Keys).
   - Run `npm run dev`. The server will start (default is usually port 5000) and Sequelize will automatically create the tables based on the models.
3. **Frontend**:
   - Navigate to the `Client/` folder in a new terminal window.
   - Run `npm install` to install dependencies.
   - Create a `.env` file if needed for the backend URL (e.g., `VITE_API_URL=http://localhost:5000`).
   - Run `npm run dev`. The React application will open in your browser.

## 8. Summary
This project represents a full-stack, real-world application handling user authentication, relational data mapping (Users -> Rides -> Bookings), and remote third-party API integration (Razorpay). 

If you are reading the codebase to understand how a feature works, always follow the flow from front to back:
1. **Frontend UI Interaction** (Button Click/Form Submit) 
2. **Frontend Axios API Call** (e.g., `axios.post('/api/bookings')`)
3. **Backend Route** (Matches the URL)
4. **Backend Controller** (Handles logic)
5. **Database Model** (Sequelize interacts with PostgreSQL)
6. **Response** (Data is sent back to the Frontend UI)

Understanding this request-response cycle is the most important key to mastering this project architecture!
