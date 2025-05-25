import React from 'react';
import { FaBus, FaMapMarkerAlt, FaCircle } from 'react-icons/fa';

interface Stop {
  id: string;
  route_stop_id: string;
  name: string;
  city: string;
  location: string;
  sequence: number;
}

interface StopTime {
  id: string;
  route_stop_id: string;
  arrival_time: string | null;
  departure_time: string | null;
}

interface JourneyRouteProps {
  stops: Stop[];
  stopTimes: StopTime[];
}

const JourneyRoute: React.FC<JourneyRouteProps> = ({ stops, stopTimes }) => {
  // Format time to 12-hour format with AM/PM
  const formatTime = (time: string | null) => {
    if (!time) return '-';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Find stop time for a stop
  const findStopTime = (stopId: string) => {
    return stopTimes.find(st => st.route_stop_id.includes(stopId));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaBus className="mr-2 text-blue-600" /> Route & Schedule
      </h2>
      
      <div className="relative">
        {stops.map((stop, index) => {
          console.log('Stop:', stop);
          const stopTime = findStopTime(stop.route_stop_id);
          const isFirst = index === 0;
          const isLast = index === stops.length - 1;
          
          return (
            <div key={stop.id} className="flex mb-6 relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-3 top-6 w-0.5 bg-blue-300 h-full" />
              )}
              
              {/* Stop point */}
              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${isFirst || isLast ? 'bg-blue-600' : 'bg-blue-400'}`}>
                {isFirst ? (
                  <FaMapMarkerAlt className="text-white text-xs" />
                ) : isLast ? (
                  <FaMapMarkerAlt className="text-white text-xs" />
                ) : (
                  <FaCircle className="text-white text-xs" />
                )}
              </div>
              
              {/* Stop details */}
              <div className="ml-4 flex-grow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{stop.name}</h3>
                    <p className="text-sm text-gray-500">{stop.city}</p>
                  </div>
                  <div className="text-right">
                    {stopTime && stopTime.arrival_time && (
                      <div>
                        <span className="text-xs text-gray-500">Arrival</span>
                        <p className="font-medium">{formatTime(stopTime.arrival_time)}</p>
                      </div>
                    )}
                    {stopTime && stopTime.departure_time && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">Departure</span>
                        <p className="font-medium">{formatTime(stopTime.departure_time)}</p>
                      </div>
                    )}
                    {!stopTime && <p className="text-gray-500">No timing data</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyRoute;