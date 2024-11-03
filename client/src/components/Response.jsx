import React, { useEffect, useState, useRef } from 'react';
import { CircleDot, Cloud, Wind, Bot, ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Response() {
    const [currentStep, setCurrentStep] = useState(0);
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const hasExecuted = useRef(false);
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [aiResponse, setAiResponse] = useState('');
    const loc = useLocation();
    const { lat, lon , userMailId} = loc.state;
    const [location, setLocation] = useState({ lat: lat, lon: lon });
    const geoapifyApiKey = 'a2c649229ea54800bdd6f0ef98e10122';

    const steps = [
        { icon: CircleDot, title: 'Analyzing Location', color: 'text-blue-500' },
        { icon: Cloud, title: 'Checking Air Quality', color: 'text-purple-500' },
        { icon: Wind, title: 'Fetching Weather Data', color: 'text-green-500' },
        { icon: Bot, title: 'Generating AI Report on your Environment', color: 'text-amber-500' }
    ];

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
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`;
            const response = await fetch(url);
            const data = await response.json();
            const weatherCodes = {
                0: 'Clear sky', 1: 'Partly cloudy', 2: 'Cloudy', 3: 'Overcast',
                45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle',
                53: 'Moderate drizzle', 55: 'Dense drizzle', 61: 'Slight rain',
                63: 'Moderate rain', 65: 'Heavy rain'
            };
            setWeatherData({
                temperature: data.current.temperature_2m,
                conditions: weatherCodes[data.current.weathercode] || 'Unknown'
            });
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const fetchAirQuality = async () => {
        try {
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5`;
            const response = await fetch(url);
            const data = await response.json();
            setAirQualityData({
                pm25: data.current.pm2_5,
                pm10: data.current.pm10
            });
        } catch (error) {
            console.error('Error fetching air quality:', error);
        }
    };

    const preprocessText = (text) => 
    {
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
        let replacement = "</br><b>•</b> "; 
        let newResponse2 = newResponse.replace(pattern, replacement);
        pattern = /(\r?\n\s*){2,}/g;
        replacement = "</br> ";
        newResponse2 = newResponse2.replace(pattern, replacement);
        pattern = /- <b>/g;
        replacement = "</br> - <b> ";
        newResponse2 = newResponse2.replace(pattern, replacement);
        newResponse2 = newResponse2.replace("</br>", " ");
        return newResponse2;
    };


    const fetchAIResponse = async () => {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5`;
        const airResponse = await fetch(url);
        const airData = await airResponse.json();
        const particularMatter2_5 = airData.hourly.pm2_5[0];
        const particularMatter10 = airData.hourly.pm10[0];

        const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunset,sunrise,weathercode&timezone=auto`;
        const weatherRes = await fetch(url2);
        const weatherDataResponse = await weatherRes.json();
        const temperature_2m_max = weatherDataResponse.daily.temperature_2m_max[0];
        const temperature_2m_min = weatherDataResponse.daily.temperature_2m_min[0];
        const placeNames = nearbyPlaces.map(place => place.properties.name).join(' ');
        const airQualityDetail = `ParticularMatter2_5: ${particularMatter2_5} ParticularMatter10: ${particularMatter10}`;
        const weatherDetail = `Temperature_2m_max: ${temperature_2m_max} Temperature_2m_min: ${temperature_2m_min}`;

        try {
            const response = await axios.post("http://127.0.0.1:8000/suggestion", {
                nearbyPlacesData: placeNames,
                airQualityData: airQualityDetail,
                weatherData: weatherDetail,
                userMailId : userMailId
            }, {
                headers: { "Content-Type": "application/json" }
            });
            const text = preprocessText(response.data.results);
            //console.log(text)
            setAiResponse(text);

        } catch (error) {
            console.error('Error fetching AI response:', error);
            setAiResponse('Unable to generate AI analysis at this time.');
        }
    };

    const handleNavigation = () => {
        navigate('/questionnaire' , {state : {userMailId}});
    };

    useEffect(() => {
        setLocation({ lat: lat, lon: lon });
    }, [lat, lon]);

    useEffect(() => {
        if (location.lat && location.lon) {
            fetchNearbyHealthcare();
            fetchWeatherData();
            fetchAirQuality();
        }
    }, [location]);

    useEffect(() => {
        if (!hasExecuted.current) {
            hasExecuted.current = true;
            fetchAIResponse();
        }
    }, []);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setProgress(0); // Reset progress for each step
            setCurrentStep(prev => {
                if (prev >= steps.length - 1) {
                    clearInterval(stepInterval);
                    setTimeout(() => setShowCompletion(true), 1000); // Show completion after the last step
                    return prev;
                }

                // Start loading progress for the next step
                const newStep = prev + 1;
                const progressInterval = setInterval(() => {
                    setProgress(oldProgress => {
                        if (oldProgress >= 100) {
                            clearInterval(progressInterval);
                            return 100; // Ensure it caps at 100
                        }
                        return oldProgress + 1; // Increment progress
                    });
                }, 50);

                // Clear the progress interval when moving to the next step
                return newStep;
            });
        }, 4000); // Duration for each step

        return () => clearInterval(stepInterval); // Clear step interval
    }, []);

    if (showCompletion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Complete!</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {weatherData && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-800 mb-2">Weather Conditions</h3>
                                    <p>Current Temperature: {weatherData.temperature}°C</p>
                                    <p>Conditions: {weatherData.conditions}</p>
                                </div>
                            )}
                            {airQualityData && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-purple-800 mb-2">Air Quality</h3>
                                    <p>PM2.5: {airQualityData.pm25} µg/m³</p>
                                    <p>PM10: {airQualityData.pm10} µg/m³</p>
                                </div>
                            )}
                        </div>
                        {aiResponse && (
                            <div className="bg-amber-50 p-4 rounded-lg mb-4 text-left">
                                <h3 className="font-semibold text-amber-800 mb-2">AI Suggestions</h3>
                                <div>{aiResponse}</div>
                            </div>
                        )}
                    </div>
                    <button
                        className="mt-4 w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition duration-300"
                        onClick={handleNavigation}
                    >
                        Go to Questionnaire
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing...</h2>
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <step.icon className={`h-6 w-6 ${step.color} mr-2`} />
                            <span className={`text-gray-700 ${index === currentStep ? 'font-semibold' : ''}`}>
                                {step.title}
                            </span>
                            {index === currentStep && (
                                <div className="relative flex-1 h-2 bg-gray-200 rounded-full ml-4">
                                    <div
                                        className="absolute h-full bg-blue-600 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Response;
