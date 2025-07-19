// Test script to verify the weather/tide fetching logic
const fs = require('fs');

const CONFIG = {
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    LATITUDE: 42.2181,
    LONGITUDE: -70.9395,
    NOAA_STATION_ID: '8443970'
};

console.log('Testing weather API connection...');
console.log('API Key present:', !!CONFIG.OPENWEATHER_API_KEY);
console.log('API Key length:', CONFIG.OPENWEATHER_API_KEY?.length || 0);

// Quick test of the weather API URL
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${CONFIG.LATITUDE}&lon=${CONFIG.LONGITUDE}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=imperial`;
console.log('Weather URL (partial):', weatherUrl.substring(0, 100) + '...');

async function testFetch() {
    try {
        const response = await fetch(weatherUrl);
        console.log('Weather API Response Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Weather data received, forecast count:', data.list?.length);
            return true;
        } else {
            console.log('Weather API Error:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Network error:', error.message);
        return false;
    }
}

testFetch();