import React from 'react';
import { FaCheckCircle, FaClock, FaExchangeAlt } from 'react-icons/fa';
import type { BusSchedule } from '../utils/type';

interface ScheduleCardProps {
  schedule: BusSchedule;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  // Get the first journey (we'll display the first available one)
  const journey = schedule.journeys && schedule.journeys.length > 0 ? schedule.journeys[0] : null;
  
  // Format time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Calculate duration in a readable format
  const getDuration = () => {
    if (schedule.total_duration) {
      const hours = Math.floor(schedule.total_duration / 60);
      const minutes = schedule.total_duration % 60;
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4 transition-all hover:shadow-lg">
      <div className="p-5">
        {/* Bus Company and Type */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-800">{schedule.operator_name}</span>
            <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {schedule.bus_type}
            </span>
            {schedule.bus_name && (
              <span className="ml-2 text-sm text-gray-600">
                {schedule.bus_name}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded flex items-center">
              <FaCheckCircle className="mr-1" /> Certified
            </span>
          </div>
        </div>

        {/* Route Information */}
        <div className="relative pt-2 pb-4">
          <div className="flex justify-between items-start">
            {/* Departure Information */}
            <div className="flex flex-col items-start">
              <span className="text-gray-500 text-sm">DEPARTS</span>
              <span className="font-bold text-xl">
                {journey?.departure_time ? formatTime(journey.departure_time) : 'N/A'}
              </span>
              <span className="text-gray-700 font-semibold">
                {schedule.stops && schedule.stops.length > 0 && schedule.stops[0]?.name || 'Source'}
              </span>
            </div>
            
            {/* Duration */}
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-xs flex items-center">
                <FaClock className="mr-1" /> DURATION
              </span>
              <div className="h-0.5 w-20 md:w-32 lg:w-48 bg-gray-300 my-2 relative">
                <span className="absolute -translate-y-1/2 top-1/2 left-1/2 transform -translate-x-1/2 bg-white px-2">
                  <FaExchangeAlt className="text-gray-400" />
                </span>
              </div>
              <span className="text-gray-700 font-medium">{getDuration()}</span>
            </div>
            
            {/* Arrival Information */}
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-sm">ARRIVES</span>
              <span className="font-bold text-xl">
                {journey?.arrival_time ? formatTime(journey.arrival_time) : 'N/A'}
              </span>
              <span className="text-gray-700 font-semibold text-right">
                {schedule.stops && schedule.stops.length > 0 && 
                 schedule.stops[schedule.stops.length - 1]?.name || 'Destination'}
              </span>
            </div>
          </div>
        </div>

        {/* Amenities and Price */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex space-x-3">
            {schedule.bus_type === 'AC' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <FaCheckCircle className="mr-1 text-green-600" size={10} />
                Air Conditioned
              </span>
            )}
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <FaCheckCircle className="mr-1 text-green-600" size={10} />
              Footrest Seats
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <FaCheckCircle className="mr-1 text-green-600" size={10} />
              Large Windows
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">for as low as</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-800">{schedule.fare}</span>
              <span className="ml-1 text-sm text-gray-600">LKR</span>
            </div>
            <div className="text-xs text-gray-500">PER SEAT</div>
          </div>
        </div>

        {/* Days of Operation */}
        {journey?.days_of_week && journey.days_of_week.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Operates on: </span>
            {journey.days_of_week.join(', ')}
          </div>
        )}

        {/* Schedule Status - If seats available information is added later */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-red-600">Limited seats left</span>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;