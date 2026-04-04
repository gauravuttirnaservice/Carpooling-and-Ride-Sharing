import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBookingContext must be used within a BookingProvider');
    }
    return context;
};

export const BookingProvider = ({ children }) => {
    const [bookingData, setBookingData] = useState(null);

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    );
};
