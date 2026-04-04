import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CityProvider } from "./contexts/CityContext.jsx";
import { BookingProvider } from "./contexts/BookingContext.jsx";
import { SearchProvider } from "./contexts/SearchContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CityProvider>
      <BookingProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </BookingProvider>
    </CityProvider>
  </React.StrictMode>,
);
