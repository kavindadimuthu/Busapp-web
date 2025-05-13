import React from 'react';
import { FaRegCalendarAlt, FaClock } from 'react-icons/fa';

interface JourneyScheduleProps {
  departureTime: string;
  arrivalTime: string;
  daysOfWeek: string[];
  validFrom: string;
  validUntil: string | null;
  totalDuration: number;
}

const JourneySchedule: React.FC<JourneyScheduleProps> = ({ 
  departureTime, 
  arrivalTime, 
  daysOfWeek,
  validFrom,
  validUntil,
  totalDuration
}) => {
  // Format time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Calculate duration in a readable format
  const getDuration = () => {
    if (totalDuration) {
      const hours = Math.floor(totalDuration / 60);
      const minutes = totalDuration % 60;
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaRegCalendarAlt className="mr-2 text-blue-600" /> Schedule Information
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Departure Time</h3>
          <p className="text-2xl font-bold text-blue-700">{formatTime(departureTime)}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Arrival Time</h3>
          <p className="text-2xl font-bold text-blue-700">{formatTime(arrivalTime)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center text-gray-700 mb-3">
          <FaClock className="mr-2 text-blue-600" />
          <span className="font-medium">Journey Duration:</span>
          <span className="ml-2">{getDuration()}</span>
        </div>
        
        <div className="flex items-center text-gray-700 mb-3">
          <FaRegCalendarAlt className="mr-2 text-blue-600" />
          <span className="font-medium">Days of Operation:</span>
          <div className="ml-2 flex flex-wrap gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span 
                key={day}
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  daysOfWeek.includes(day) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Valid from:</span> {formatDate(validFrom)}
            {validUntil && (
              <> | <span className="font-medium">Valid until:</span> {formatDate(validUntil)}</>
            )}
            {!validUntil && (
              <> | <span className="text-green-600">No end date (ongoing service)</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JourneySchedule;