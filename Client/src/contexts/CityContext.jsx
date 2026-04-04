import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const CityContext = createContext();

export const useCityContext = () => useContext(CityContext);

export const CityProvider = ({ children }) => {
    const [popularCities, setPopularCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axiosInstance.get('/cities/popular');
                if (response.data.success) {
                    setPopularCities(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch popular cities from Context', error);
            } finally {
                setLoading(false)
            }
        };
        fetchCities();
    }, []);

    return (
        <CityContext.Provider value={{ popularCities, loading }}>
            {children}
        </CityContext.Provider>
    );
};
