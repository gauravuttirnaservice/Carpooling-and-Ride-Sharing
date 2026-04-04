import { City, CityPoint } from '../models/index.js';

export const getPopularCities = async (req, res) => {
    try {
        const cities = await City.findAll({
            include: [
                {
                    model: CityPoint,
                    as: "points",
                    attributes: ["PointName"]
                }
            ],
            order: [
                ["CityName", "ASC"]
            ]
        });

        const formattedCities = cities.map(city => ({
            city: city.CityName,
            points: city.points ? city.points.map(p => p.PointName) : []
        }));

        res.status(200).json({ success: true, count: formattedCities.length, data: formattedCities });
    } catch (error) {
        console.error("Error fetching popular cities from DB:", error);
        res.status(500).json({ success: false, message: "Error fetching popular cities", error: error.message });
    }
};
