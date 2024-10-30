import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Response.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Response = () => {
    const navigate = useNavigate();
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [weather, setWeather] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [map, setMap] = useState(null);
    const location = useLocation();
    const { lat, lon } = location.state;
    const [llmResponse, setLlmResponse] = useState("");
    const [typedResponse, setTypedResponse] = useState("");
    const [typingIndex, setTypingIndex] = useState(0);
    const [envState, setEnvState] = useState(false);
    const [llmSuggestion, setSuggestion] = useState(false);
    const hasExecuted = useRef(false);
    let done = false;
    const typingSpeed = 3;

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
            console.log('Nearby API Response:', data.features)
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
            const airData = await response.json();
            setAirQuality(airData);
        } catch (error) {
            console.error("Error fetching air quality data:", error);
        }
    };

    const preprocessText = (text) => {
        let formattedText = String(text)
        let responseArray = formattedText.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let pattern = /\*/g;
        let replacement = "</br><b>•</b> "; // Replacement string
        let newResponse2 = newResponse.replace(pattern, replacement);
        pattern = /(\r?\n\s*){2,}/g;
        replacement = "</br> ";
        newResponse2 = newResponse2.replace(pattern, replacement);
        pattern = /- <b>/g;
        replacement = "</br> - <b> ";
        newResponse2 = newResponse2.replace(pattern, replacement);
        return newResponse2;
    };

    const handleResponse = async () => {
        if (llmSuggestion && done) return;

        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5`;
        const response = await fetch(url);
        const airData = await response.json();
        const particularMatter2_5 = airData.hourly.pm2_5[0];
        const particularMatter10 = airData.hourly.pm10[0];

        const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunset,sunrise,weathercode&timezone=auto`;
        const response2 = await fetch(url2);
        const weatherRes = await response2.json();
        const temperature_2m_max = weatherRes.daily.temperature_2m_max[0];
        const temperature_2m_min = weatherRes.daily.temperature_2m_min[0];
        const placeNames = [];
        nearbyPlaces.forEach(place => {
            placeNames.push(place.properties.name);
        })
        const nearbyPlacesData = placeNames.join(' ');
        const airQualityData = String(particularMatter2_5) + String(particularMatter10);
        const weatherData = String(temperature_2m_max) + String(temperature_2m_min)
        console.log("Placename : ", typeof (nearbyPlacesData));
        try {
            if (!llmSuggestion && !done) {
                const response = await axios.post("http://127.0.0.1:8000/suggestion",
                    {
                        nearbyPlacesData: nearbyPlacesData,
                        airQualityData: airQualityData,
                        weatherData: weatherData
                    }, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" }
                });
                const text = preprocessText(response.data.results);
                setLlmResponse(text);
                setTypedResponse("");
                setTypingIndex(0);
                setEnvState(true);
                setSuggestion(true);
                done = true;
            }
        } catch (error) {
            const text = "An error occurred while generating suggestions. Meanwhile, please interpret the available data until the issue is resolved.";
            console.error("Error fetching LLM response", error);
        }
    }

    const handleNavigation = () => {
        navigate('/questionnaire');
    }

    useEffect(() => {
        if (weather && airQuality && nearbyPlaces && typingIndex < llmResponse.length) {
            const typingTimeout = setTimeout(() => {
                setTypedResponse((prev) => prev + llmResponse[typingIndex]);
                setTypingIndex((prev) => prev + 1);
            }, typingSpeed);
            return () => clearTimeout(typingTimeout);
        }
    }, [typingIndex, llmResponse, weather, airQuality, nearbyPlaces]);

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
            fillOpacity: 0.2,
            radius: 4000,
            weight: 1
        }).addTo(initialMap);

        setMap(initialMap);

        return () => {
            initialMap.remove();
        };
    }, [lat, lon]);

    useEffect(() => {
        if (!llmSuggestion && !done) 
        {
            fetchNearbyHealthcare();
            fetchWeatherData();
            fetchAirQualityData();
        }
    }, [lat, lon]);
    useEffect(() => {
        if (!hasExecuted.current) {
            handleResponse();
            console.log('This runs only once');
            hasExecuted.current = true; 
        }
    }, []);
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
            
            <div className="card p-3" style={{ textAlign: 'left' }}>
                <h3 style={{ color: '#4a148c', fontWeight: '600', marginBottom: '10px' , fontSize: '20px'}}>
                    ARIA's Environment Analysis
                </h3>
                <div style={{
                    color: '#888999',
                    backgroundColor: 'black',
                    borderRadius: '5px',
                    padding: '10px',
                    textAlign: 'left'
                }}>
                    {envState ? (
                        <div style={{
                            color: envState ? "white" : "#888999",
                            whiteSpace: 'pre-wrap',
                            fontSize: '17px'
                        }}
                            dangerouslySetInnerHTML={{ __html: typedResponse }}>
                        </div>
                    ) : "Your Environment Analysis will be resulted here"}
                </div>
            </div>
            {envState? (<button onClick={()=>handleNavigation()}>Go to the next page</button>): (<div></div>)}
        </div>
    );
};

export default Response;
