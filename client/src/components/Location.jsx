import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { MapPin, Navigation, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

function Location() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lon: 0 });
  const [mapLocationName, setMapLocationName] = useState('Your Location');
  const [analysis, setAnalysis] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loc = useLocation();
  const userMailId = loc.state.userMailId;


  const handleLocationStore = async(locate, latit, longit) => {
    console.log(typeof(userMailId))
    try {
      const response = await axios.post("http://127.0.0.1:8000/storeLocation", {
        latitute : latit,
        longitude: longit,
        locationName: locate,
        userMailId : userMailId
      }, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response.data.message)

    } catch (error) {
      console.error('Error Storing Location', error);
    }
  }
  const handleLocationFetch = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lon: longitude });
          setLat(latitude);
          setLon(longitude);
          console.log(typeof(mapCenter.lat))
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
            handleLocationStore(response.data.display_name, mapCenter.lat, mapCenter.lon);
          } catch (err) {
            console.error(err);
            setError('Unable to retrieve location name.');
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError('Unable to retrieve your location. Please enter it manually.');
          console.error(err);
          setIsLoading(false);
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
      navigate('/response', { state: { lat, lon ,userMailId} });
    } else {
      setError('Location coordinates are not defined.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <MapPin className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Location Finder</h2>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleLocationFetch}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Navigation className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Getting Location...' : 'Get My Location'}
              </button>

              {error && (
                <div className="space-y-4">
                  <div className="flex items-center text-red-500 dark:text-red-400">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p className="text-sm">{error}</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter location manually"
                    value={location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {location && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Your Location:</span> {location}
                  </p>
                </div>
              )}

              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  title="Location Map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lon - 0.1},${mapCenter.lat - 0.1},${mapCenter.lon + 0.1},${mapCenter.lat + 0.1}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lon}`}
                  className="w-full h-[400px] border-none"
                  allowFullScreen
                />
                <p className="text-center py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm">
                  {mapLocationName}
                </p>
              </div>

              {analysis && (
                <button
                  onClick={handleNavigation}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Analyse Environment
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;