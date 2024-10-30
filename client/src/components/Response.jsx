import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Response.css';
import { useLocation } from 'react-router-dom';

const Response = () => {
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [weather, setWeather] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [map, setMap] = useState(null);
    const location = useLocation();
    const { lat, lon } = location.state;

    const geoapifyApiKey = 'a2c649229ea54800bdd6f0ef98e10122';

    const fetchNearbyHealthcare = async () => {
        const rect = `${lon - 0.05},${lat - 0.05},${lon + 0.2},${lat + 0.2}`;
        const url = `https://api.geoapify.com/v2/places?categories=healthcare&filter=rect:${rect}&limit=20&apiKey=${geoapifyApiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            setNearbyPlaces(data.features);
        } catch (error) {
            console.error("Error fetching nearby healthcare:", error);
        }
    };

    const fetchWeatherData = async () => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunset,sunrise,weathercode&timezone=auto`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log('Weather API Response:', data.daily);
            setWeather(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const fetchAirQualityData = async () => {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log('Air Quality API Response:', data.hourly);
            setAirQuality(data);
        } catch (error) {
            console.error("Error fetching air quality data:", error);
        }
    };

    useEffect(() => {
        const initialMap = L.map('map', {
            center: [lat, lon],
            zoom: 13,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(initialMap);

        L.marker([lat, lon]).addTo(initialMap).bindPopup('You are here').openPopup();

        L.circle([lat, lon], {
            color: 'blue',
            fillColor: '#03fcb2',
            fillOpacity: 0.5,
            radius: 1000, 
        }).addTo(initialMap);

        setMap(initialMap);

        return () => {
            initialMap.remove();
        };
    }, [lat, lon]);

    useEffect(() => {
        fetchNearbyHealthcare();
        fetchWeatherData();
        fetchAirQualityData();
    }, [lat, lon]);

    useEffect(() => {
        if (map && nearbyPlaces.length) {

            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
            nearbyPlaces.forEach(place => {
                const { geometry, properties } = place;
                if (geometry && properties) {
                    const healthcareLocation = geometry.coordinates.reverse();
                    //console.log('Adding marker for:', properties.name, healthcareLocation);

                    const healthcareIcon = new L.Icon({
                        iconUrl: 'https://img.icons8.com/?size=100&id=SW3XuuLGhOrk&format=png&color=000000',
                        iconSize: [25, 25],
                        iconAnchor: [12, 12],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    });

                    L.marker(healthcareLocation, { icon: healthcareIcon })
                        .addTo(map)
                        .bindPopup(`
                            <strong>${properties.name}</strong><br>
                            ${properties.address_line1 || ''}<br>
                            ${properties.address_line2 || ''}<br>
                        `);
                }
            });
        }
    }, [map, nearbyPlaces]);

    return (
        <div className="response-container" style={{ width: "800px" }}>
            <h2>Your Environment Analysis</h2>
            <div>
                <h2>Nearby Healthcare</h2>
                <div id="map" className="map-container" style={{ height: "400px" }}></div>
            </div>

            <div className='weather-air-container' style={{ alignItems: "center", textAlign: "center" }}>
                {weather ? (
                    <div>
                        <h3>Current Weather</h3>
                        <p>Max Temperature: {weather.daily.temperature_2m_max[0]}°C</p>
                        <p>Min Temperature: {weather.daily.temperature_2m_min[0]}°C</p>
                        <p>Precipitation: {weather.daily.precipitation_sum[0]} mm</p>
                        <p>Sunrise: {new Date(weather.daily.sunrise[0]).toLocaleTimeString()}</p>
                        <p>Sunset: {new Date(weather.daily.sunset[0]).toLocaleTimeString()}</p>
                    </div>
                ) : <div></div>}

                {airQuality ? (
                    <div>
                        <h3>Air Quality Index</h3>
                        <p>PM10: {airQuality.hourly.pm10[0]} μg/m³</p>
                        <p>PM2.5: {airQuality.hourly.pm2_5[0]} μg/m³</p>
                    </div>
                ) : <div></div>}
            </div>
        </div>
    );
};

export default Response;
