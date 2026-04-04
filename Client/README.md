# RideShare Connect - React Application

A modern, production-ready React application for a rideshare platform with clean architecture and comprehensive form validation.

## Features

- ✅ Modern React with functional components
- ✅ React Router v6+ for navigation
- ✅ Tailwind CSS for styling (no external CSS files)
- ✅ react-hook-form for form handling and validation
- ✅ Fully responsive design
- ✅ Clean component architecture
- ✅ Production-ready code

## Project Structure

```
rideshare-react/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Navigation with mobile menu
│   │   ├── Footer.jsx             # Footer with links
│   │   ├── HeroSection.jsx        # Hero banner section
│   │   ├── BenefitsSection.jsx    # Benefits showcase section
│   │   ├── HowItWorksSection.jsx  # Process steps section
│   │   ├── CTASection.jsx         # Call-to-action section
│   │   ├── SearchForm.jsx         # Search form with validation
│   │   ├── BenefitCard.jsx        # Reusable benefit card
│   │   └── HowItWorksStep.jsx     # Reusable step component
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── LoginPage.jsx       # Login with validation
│   │   ├── SignUpPage.jsx      # Sign up with validation
│   │   ├── RideListingPage.jsx # Ride listings
│   │   └── OfferRidePage.jsx   # Offer ride page
│   ├── App.jsx                 # Router configuration
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind directives
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Form Validation

All forms use react-hook-form with comprehensive validation:

### Search Form (SearchForm.jsx)
- From location: Required, min 2 characters
- To location: Required, min 2 characters
- Date: Required, cannot be in the past

### Login Form (LoginPage.jsx)
- Email: Required, valid email format
- Password: Required, min 6 characters

### Sign Up Form (SignUpPage.jsx)
- Full Name: Required, min 3 characters
- Email: Required, valid email format
- Phone: Required, 10 digits
- Password: Required, min 8 characters, must contain uppercase, lowercase, and number
- Confirm Password: Required, must match password
- Terms: Required checkbox

## Routing

- `/` - Home page
- `/rides` - Ride listings (with search params)
- `/offer-ride` - Offer a ride
- `/login` - Login page
- `/signup` - Sign up page

## Technologies Used

- **React 18.2** - UI library
- **React Router v6** - Client-side routing
- **react-hook-form 7** - Form handling and validation
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vite 5** - Build tool
- **Google Fonts** - Spline Sans & Noto Sans
- **Material Symbols** - Icons

## Key Components

### Navbar
- Responsive navigation with mobile menu
- Active link highlighting using NavLink
- Programmatic navigation with useNavigate

### SearchForm
- Controlled form with react-hook-form
- Real-time validation
- Date validation (no past dates)
- Navigates to /rides with query params

### LoginPage & SignUpPage
- Complete form validation
- Error messages for all fields
- Social login UI (Google, Facebook)
- Password strength validation (SignUp)
- Password confirmation matching (SignUp)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
