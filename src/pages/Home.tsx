import { useEffect, useState } from 'react';
import SearchForm from '../components/SearchForm';
import ScheduleCard from '../components/ScheduleCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaBus, FaFilter, FaInfoCircle } from 'react-icons/fa';
import { searchSchedules, getStops } from '../utils/apiHelper';
import type { BusSchedule, Stop } from '../utils/type';

// Helper type for filters
type FilterState = {
  source: string;
  destination: string;
  day: string;
  date?: string;
  operator?: string;
  bus_type?: string;
};

// Define a type for search parameters
type SearchParams = {
  source: string;
  destination: string;
  date?: string;
  operator?: string;
  bus_type?: string;
  // Add other possible parameters here
};

// Bus type adapter for the ScheduleCard component
type BusForCard = {
  bus_id: number;
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

// Convert the API bus schedule format to the format expected by ScheduleCard
const mapScheduleToBusCard = (schedule: BusSchedule): BusForCard => {
  return {
    bus_id: parseInt(schedule.bus_id, 10), // Convert to number
    bus_name: schedule.bus_name,
    bus_number: schedule.bus_number,
    operator_name: schedule.operator_name,
    source_stop: schedule.source_stop_name,
    destination_stop: schedule.destination_stop_name,
    day_of_week: schedule.days_of_week.join(', '),
    start_time: schedule.times[0].departure_time,
    type: schedule.bus_type,
    fare: Number(schedule.fare),
    // Copy other properties as needed
  };
};

export default function Home() {
  const [buses, setBuses] = useState<BusForCard[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [filters, setFilters] = useState<FilterState>({ source: '', destination: '', day: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('time');
  const [busTypes, setBusTypes] = useState<string[]>([]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch stops on component mount
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const stopsData = await getStops();
        setStops(stopsData);
      } catch (err) {
        console.error('Failed to fetch stops:', err);
        setError('Failed to load stops. Please try again later.');
      }
    };

    fetchStops();
  }, []);

  // Handle search when filters change
  useEffect(() => {
    const fetchBuses = async () => {
      if (!filters.source && !filters.destination && !filters.day) {
        // Optionally load some initial buses or keep empty until search
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Convert day filter to the appropriate format if needed
        const searchParams: SearchParams = {
          source: filters.source,
          destination: filters.destination
        };
        
        // If date is provided, use it instead of day
        if (filters.date) {
          searchParams.date = filters.date;
        }
        
        // Add other filters if selected
        if (filters.operator) {
          searchParams.operator = filters.operator;
        }
        
        if (selectedBusTypes.length > 0) {
          searchParams.bus_type = selectedBusTypes[0]; // API seems to support single bus type
        }
        
        const schedulesData = await searchSchedules(searchParams);
        
        // Get unique bus types for filtering
        const types = Array.from(new Set(schedulesData.map(schedule => schedule.bus_type)));
        setBusTypes(types);
        
        // Map the schedules to the format expected by ScheduleCard
        const mappedBuses = schedulesData.map(schedule => mapScheduleToBusCard(schedule));
        
        // Sort the buses
        if (sortBy === 'time') {
          mappedBuses.sort((a, b) => a.start_time.localeCompare(b.start_time));
        } else if (sortBy === 'price_low') {
          mappedBuses.sort((a, b) => a.fare - b.fare);
        } else if (sortBy === 'price_high') {
          mappedBuses.sort((a, b) => b.fare - a.fare);
        }
        
        setBuses(mappedBuses);
      } catch (err) {
        console.error('Failed to fetch buses:', err);
        setError('Failed to load buses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, [filters, sortBy, selectedBusTypes]);

  const handleSearch = (searchFilters: { source: string; destination: string; day: string; date?: string }) => {
    setFilters(searchFilters);
  };

  const toggleBusType = (type: string) => {
    setSelectedBusTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the Header component */}
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <SearchForm onSearch={handleSearch} stops={stops} isLoading={isLoading} />
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4" role="alert">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        
        {/* Results section */}
        <div className="mt-6">
          {/* Filters and sorting tools */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="flex items-center mb-3 md:mb-0">
              <h2 className="text-xl font-semibold">
                {isLoading ? 'Searching for buses...' : 
                  buses.length > 0 ? `Found ${buses.length} buses` : 'No buses found'}
              </h2>
              
              <button 
                className="ml-4 flex items-center text-blue-600 hover:text-blue-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-1" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
            
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2">Sort by: </label>
              <select 
                className="text-sm border rounded px-2 py-1"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="time">Departure Time</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Filter options - conditionally shown */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
                <div className="space-y-1">
                  {busTypes.length > 0 ? (
                    busTypes.map(type => (
                      <div key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`type-${type}`} 
                          className="mr-2"
                          checked={selectedBusTypes.includes(type)}
                          onChange={() => toggleBusType(type)}  
                        />
                        <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No bus types available</div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operators</label>
                <div className="space-y-1">
                  {Array.from(new Set(buses.map(bus => bus.operator_name))).map(operator => (
                    <div key={operator} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={`operator-${operator}`} 
                        className="mr-2"
                      />
                      <label htmlFor={`operator-${operator}`} className="text-sm">{operator}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <input 
                  type="range" 
                  min={Math.min(...buses.map(bus => bus.fare), 0)}
                  max={Math.max(...buses.map(bus => bus.fare), 1000)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Min: ₹{Math.min(...buses.map(bus => bus.fare), 0)}</span>
                  <span>Max: ₹{Math.max(...buses.map(bus => bus.fare), 1000)}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          )}
          
          {/* No results state */}
          {!isLoading && buses.length === 0 && (filters.source || filters.destination) && (
            <div className="bg-white rounded-lg shadow p-8 text-center my-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <FaInfoCircle className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No buses found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any buses matching your search criteria.
              </p>
              <ul className="text-left max-w-md mx-auto text-sm text-gray-600 mb-6">
                <li className="mb-1">• Try different dates</li>
                <li className="mb-1">• Try different routes</li>
                <li className="mb-1">• Try removing some filters</li>
              </ul>
              <button 
                onClick={() => setFilters({ source: '', destination: '', day: '' })} 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset search
              </button>
            </div>
          )}
          
          {/* Initial state - prompt to search */}
          {!isLoading && buses.length === 0 && !filters.source && !filters.destination && (
            <div className="bg-white rounded-lg shadow p-8 text-center my-8">
              <FaBus className="text-5xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search for Bus Tickets</h3>
              <p className="text-gray-600">
                Select your source and destination to search for available buses.
              </p>
            </div>
          )}
          
          {/* Bus schedule cards */}
          {!isLoading && buses.length > 0 && (
            <div className="space-y-4">
              {buses.map(bus => (
                <ScheduleCard key={bus.bus_id} bus={bus} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Use the Footer component */}
      <Footer />
    </div>
  );
}