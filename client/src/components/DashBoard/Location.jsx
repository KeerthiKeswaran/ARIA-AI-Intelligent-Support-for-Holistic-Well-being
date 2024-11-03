import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Location = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 20, lon: 0 });
    const [mapLocationName, setMapLocationName] = useState('World');
    const [analysis, setAnalysis] = useState(false);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);

    const handleLocationFetch = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter({ lat: latitude, lon: longitude });
                    setLat(latitude);
                    setLon(longitude);
                    setError(null);

                    try {
                        const response = await axios.get(`https://us1.locationiq.com/v1/reverse.php`, {
                            params: {
                                key: 'pk.8a829beab9924b708f5550572996e6e1',
                                lat: latitude,
                                lon: longitude,
                                format: 'json',
                            },
                        });
                        setLocation(`${response.data.display_name}`);
                        setMapLocationName(response.data.display_name);
                        setAnalysis(true);
                    } catch (err) {
                        console.error(err);
                        setError('Unable to retrieve location name.');
                    }
                },
                (err) => {
                    setError('Unable to retrieve your location. Please enter it manually.');
                    console.error(err);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };

    const handleNavigation = () => {
        if (lat !== null && lon !== null) {
            navigate('/response', { state: { lat, lon } });
        } else {
            setError('Location coordinates are not defined.');
        }
    }

    return (
        <div className="location-container">
            <h2>User Location</h2>
            <button className='locButton' onClick={handleLocationFetch}>Get My Location</button>
            <div className="input-container">
                {error ? (
                    <input
                        type="text"
                        placeholder="Enter location manually"
                        value={location}
                        onChange={handleInputChange}
                    />
                ) : <div className='empty'></div>}
            </div>
            {error && <p className="error-message">{error}</p>}
            {location && <p>Your Location: {location}</p>}

            <div className="map-container">
                <Map lat={mapCenter.lat} lon={mapCenter.lon} locationName={mapLocationName} />
            </div>
            {analysis ? (<button className='analyseButton' onClick={handleNavigation}>Analyse Environment</button>) : <div></div>}
        </div>
    );
};

const Map = ({ lat, lon, locationName }) => {
    return (
        <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
            <iframe
                title="Map"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}&layer=mapnik&marker=${lat},${lon}`}
                style={{ border: 'none', width: '100%', height: '100%' }}
                allowFullScreen
            />
            <p style={{ textAlign: 'center' }}>{locationName}</p>
        </div>
    );
};

export default Location;
