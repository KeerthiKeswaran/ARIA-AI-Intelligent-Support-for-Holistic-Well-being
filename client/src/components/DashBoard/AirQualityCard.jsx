import React from 'react';
import { Wind } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AirQualityCard = ({ data }) => {
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-success'; 
    if (aqi <= 100) return 'text-warning'; 
    if (aqi <= 150) return 'text-orange'; 
    return 'text-danger'; 
  };

  return (
    <div className="bg-gradient rounded p-4 text-black shadow">
      <div className="d-flex justify-content-between mb-4">
        <h3 className="h5" style={{fontWeight : '600'}}>Air Quality</h3>
        <Wind className="w-8 h-8" />
      </div>

      <div className="mb-4">
        <div className="display-4 font-weight-bold mb-2">{data.aqi}</div>
        <div className={`h6 font-weight-bold ${getAQIColor(data.aqi)}`}>
          {data.status}
        </div>
      </div>

      <div className="row">
        <div className="col text-center">
          <div className="small text-muted">PM2.5</div>
          <div className="font-weight-semibold">{data.pollutants.pm25}</div>
        </div>
        <div className="col text-center">
          <div className="small text-muted">PM10</div>
          <div className="font-weight-semibold">{data.pollutants.pm10}</div>
        </div>
        <div className="col text-center">
          <div className="small text-muted">O3</div>
          <div className="font-weight-semibold">{data.pollutants.o3}</div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;
