import { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { searchSchedules } from '../utils/apiHelper';
import type { BusSchedule } from '../utils/type';

const Home = () => {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<{
    source?: string;
    destination?: string;
    date?: string;
    operator?: string;
    bus_type?: string;
    route_name?: string;
    departure_time_from?: string;
    departure_time_to?: string;
    arrival_time_from?: string;
    arrival_time_to?: string;
    sort_by?: string;
    sort_order?: string;
  }>({});

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // State for sorting
  const [sortBy, setSortBy] = useState('valid_from');
  const [sortOrder, setSortOrder] = useState('ASC');
  
  // State for search results and loading status
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle search form submission
  const handleSearch = async (params: any) => {
    const updatedParams = {
      ...params,
      sort_by: sortBy,
      sort_order: sortOrder
    };
    setSearchParams(updatedParams);
    setCurrentPage(1); // Reset to first page on new search
    await fetchSchedules(updatedParams, 1);
  };

  // Handle sort change
  const handleSortChange = async (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    
    const updatedParams = {
      ...searchParams,
      sort_by: newSortBy,
      sort_order: newSortOrder
    };
    
    setSearchParams(updatedParams);
    await fetchSchedules(updatedParams, currentPage);
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchSchedules(searchParams, page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = async (itemsCount: number) => {
    setItemsPerPage(itemsCount);
    setCurrentPage(1); // Reset to first page when changing items per page
    await fetchSchedules(searchParams, 1, itemsCount);
  };

  // Fetch schedules from API
  const fetchSchedules = async (
    params: any, 
    page: number = currentPage, 
    perPage: number = itemsPerPage
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert time windows to actual time ranges if needed
      const apiParams = {
        ...params,
        limit: perPage,
        offset: (page - 1) * perPage,
        sort_by: params.sort_by || sortBy,
        sort_order: params.sort_order || sortOrder
      };

      // Call the API helper function
      const result = await searchSchedules(apiParams);
      setSchedules(result.schedules);
      
      // Use the total from the API response
      setTotalItems(result.total);
      setItemsPerPage(result.limit);
      
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to fetch schedules. Please try again later.');
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load - optional, can be removed if you don't want to load data on first render
  useEffect(() => {
    fetchSchedules({ sort_by: sortBy, sort_order: sortOrder });
  }, []);

  return (
    <>
      <Header/>
      <div className="container mx-auto py-8 px-4">
        <SearchForm 
          onSearch={handleSearch} 
          totalResults={totalItems} 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 p-4 rounded-md my-8 text-red-800 border border-red-200">
            <p>{error}</p>
          </div>
        )}
        
        {/* Results display */}
        {!isLoading && !error && schedules.length > 0 ? (
          <div className="my-8">
            <h2 className="text-xl font-bold mb-4">Search Results ({totalItems})</h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {schedules.map((schedule) => (
                <div 
                  key={schedule.schedule_id} 
                  className="p-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <h3 className="font-medium text-lg">
                    {schedule.source_stop_name} to {schedule.destination_stop_name}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Route: {schedule.route_name}</p>
                    <p>Bus: {schedule.bus_name} ({schedule.bus_type})</p>
                    <p>Operator: {schedule.operator_name}</p>
                    <p>Fare: Rs. {schedule.fare}</p>
                    <p>Valid days: {schedule.days_of_week.join(', ')}</p>
                    <p>Available times:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {schedule.times.map((time) => (
                        <li key={time.id}>
                          Departs: {time.departure_time} - Arrives: {time.arrival_time}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !isLoading && !error ? (
          <div className="my-8 bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
            <p className="text-blue-700">No schedules found with the current search criteria. Try adjusting your filters.</p>
          </div>
        ) : null}
        
        {/* Pagination - only show if we have results and more than one page */}
        {!isLoading && totalItems > 0 && (
          <Pagination 
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>
      <Footer/>
    </>
  );
};

export default Home;