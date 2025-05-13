import React from 'react';

type Bus = {
  bus_id: string | number;
  bus_name: string;
  bus_number: string;
  operator_name: string;
  source_stop: string;
  destination_stop: string;
  day_of_week: string;
  start_time: string;
  type: string;
  fare: number;
  seats_available?: number;
  amenities?: string[];
  duration?: string;
  distance?: string;
};

type ScheduleCardProps = {
  bus: Bus;
};

const ScheduleCard: React.FC<ScheduleCardProps> = ({ bus }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg mb-4">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Bus info */}
        <div className="p-4 md:w-2/3 border-r border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                bus.type === 'Express' ? 'bg-blue-100 text-blue-800' :
                bus.type === 'Premium' ? 'bg-purple-100 text-purple-800' :
                bus.type === 'Night Service' ? 'bg-indigo-100 text-indigo-800' :
                'bg-green-100 text-green-800'
              }`}>
                {bus.type}
              </span>
              <span className="ml-2 text-sm text-gray-600">{bus.day_of_week}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">Bus #{bus.bus_number}</div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{bus.bus_name}</h3>
          <p className="text-sm text-gray-600 mb-3">Operated by {bus.operator_name}</p>
          
          <div className="flex items-center mb-4">
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-900">{bus.source_stop}</span>
                <span className="font-medium text-gray-900">{bus.destination_stop}</span>
              </div>
              <div className="relative">
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-blue-500 rounded-full w-full"></div>
                </div>
                <div className="absolute left-0 -mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="absolute right-0 -mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-600">{bus.start_time}</span>
                <span className="text-sm text-gray-600">{bus.duration && `${bus.duration} journey`}</span>
              </div>
            </div>
          </div>
          
          {bus.amenities && (
            <div className="flex flex-wrap gap-1 mb-2">
              {bus.amenities.map((amenity, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Right side - Price and Book */}
        <div className="p-4 md:w-1/3 flex flex-col justify-between bg-gray-50">
          <div>
            <div className="text-xs text-gray-500 mb-1">Price per person</div>
            <div className="text-2xl font-bold text-gray-800 mb-1">Rs.{bus.fare.toFixed(2)}</div>
            <div className="text-sm text-gray-600 mb-3">{bus.distance}</div>
            
            {bus.seats_available && (
              <div className={`text-sm ${bus.seats_available < 10 ? 'text-orange-600 font-semibold' : 'text-green-600'} mb-4`}>
                {bus.seats_available < 10 ? `Only ${bus.seats_available} seats left` : `${bus.seats_available} seats available`}
              </div>
            )}
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Book Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;