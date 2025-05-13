import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';
import type { Stop } from '../utils/type';

type SearchFormProps = {
  onSearch: (filters: { source: string; destination: string; day: string; date?: string }) => void;
  stops: Stop[];
  isLoading: boolean;
};

export default function SearchForm({ onSearch, stops, isLoading }: SearchFormProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ source, destination, day, date });
  };

  const handleSwapLocations = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Source */}
          <div className="md:col-span-5 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaMapMarkerAlt className="text-blue-500" />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                value={source} 
                onChange={e => setSource(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select departure point</option>
                {stops.map(stop => (
                  <option key={stop.id} value={stop.name}>{stop.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap button - visible only on wider screens */}
          <div className="hidden md:flex md:col-span-2 items-center justify-center mt-6">
            <button 
              type="button" 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
              onClick={handleSwapLocations}
            >
              <FaExchangeAlt className="text-gray-600" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-5 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaMapMarkerAlt className="text-red-500" />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                value={destination} 
                onChange={e => setDestination(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select destination</option>
                {stops.map(stop => (
                  <option key={stop.id} value={stop.name}>{stop.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap button - visible only on mobile */}
          <div className="flex md:hidden justify-center my-1">
            <button 
              type="button" 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
              onClick={handleSwapLocations}
            >
              <FaExchangeAlt className="text-gray-600" />
            </button>
          </div>

          {/* Date picker */}
          <div className="md:col-span-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalendarAlt className="text-green-600" />
              </div>
              <input
                type="date"
                className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Day selector */}
          <div className="md:col-span-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalendarAlt className="text-green-600" />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                value={day} 
                onChange={e => setDay(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Any day</option>
                <option value="Daily">Daily</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </div>

          {/* Search button */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-transparent mb-1">Search</label>
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center font-medium"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block animate-spin mr-2">⟳</span>
              ) : null}
              {isLoading ? 'Searching...' : 'Search Buses'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
