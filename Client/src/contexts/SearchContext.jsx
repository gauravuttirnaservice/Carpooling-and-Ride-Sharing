import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useState({
        from: "",
        to: "",
        date: "",
        passengers: "1",
    });

    const [hasSearched, setHasSearched] = useState(false);

    return (
        <SearchContext.Provider value={{ searchParams, setSearchParams, hasSearched, setHasSearched }}>
            {children}
        </SearchContext.Provider>
    );
};
