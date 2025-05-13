import React from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';

interface Stop {
  id: string;
  name: string;
  city: string;
  location: string;
  sequence: number;
}

interface RouteMapProps {
  stops: Stop[];
}

const RouteMap: React.FC<RouteMapProps> = ({ stops }) => {
  // Extract coordinates from POINT format
  const extractCoordinates = (pointString: string) => {
    const match = pointString.match(/POINT\(([^ ]+) ([^)]+)\)/);
    if (match && match.length === 3) {
      return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
    return null;
  };

  // In a real app, you would use these coordinates with Google Maps, Mapbox, or Leaflet
  // For now, let's just display a placeholder
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaMapMarkedAlt className="mr-2 text-blue-600" /> Route Map
      </h2>
      
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <FaMapMarkedAlt className="text-blue-400 text-5xl mx-auto mb-2" />
          <p className="text-gray-500">Map view would be displayed here.</p>
          <p className="text-gray-500 text-sm">
            Route from {stops[0]?.name} to {stops[stops.length - 1]?.name}
          </p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {stops.map((stop) => {
          const coords = extractCoordinates(stop.location);
          return (
            <div key={stop.id} className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-medium">{stop.name}</h3>
              <p className="text-sm text-gray-600">{stop.city}</p>
              <p className="text-xs text-gray-500">
                {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'No coordinates'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteMap;