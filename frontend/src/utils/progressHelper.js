// Helper function to determine the next city to visit based on progress
export const getNextCity = (cityProgress) => {
    const cityOrder = ['Mumbai', 'Bangalore', 'Pune', 'Chennai', 'Jammu', 'Delhi'];

    // Find the first city that is not completed
    for (const city of cityOrder) {
        if (!cityProgress[city]) {
            return city;
        }
    }

    // All cities completed
    return null;
};

// Helper function to get the route for a city
export const getCityRoute = (city, isBackstory = true) => {
    if (!city) return '/';

    const cityLower = city.toLowerCase();
    return isBackstory ? `/${cityLower}/backstory` : `/${cityLower}/game`;
};

// Helper function to check if user can access a specific city
export const canAccessCity = (city, cityProgress) => {
    const cityOrder = ['Mumbai', 'Bangalore', 'Pune', 'Chennai', 'Jammu', 'Delhi'];
    const cityIndex = cityOrder.indexOf(city);

    if (cityIndex === -1) return false;
    if (cityIndex === 0) return true; // Mumbai is always accessible

    // Check if previous city is completed
    const previousCity = cityOrder[cityIndex - 1];
    return cityProgress[previousCity] === true;
};
