import { useState, useEffect } from 'react';
import SearchSection from '../components/SearchSection';
import FilterSection from '../components/FilterSection';
import Pagination from '../components/shared/Pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JourneyList from '../components/JourneyList';
import { searchJourneys } from '../utils/apiHelper';
import type { Journey, JourneySearchParams } from '../utils/type';

type FilterParams = {
  operator?: string;
  bus_type?: string;
  route_name?: string;
  departure_time_from?: string;
  departure_time_to?: string;
  arrival_time_from?: string;
  arrival_time_to?: string;
  sort_by?: string;
  sort_order?: string;
  days_of_week?: string[];
  [key: string]: string | string[] | number | undefined;
};

const Journeys = () => {
  // State for search parameters
  const [searchParams, setSearchParams] = useState<JourneySearchParams & FilterParams>({});

  // State for tracking search and filter parameters separately
  const [basicSearchParams, setBasicSearchParams] = useState<JourneySearchParams>({});
  const [filterParams, setFilterParams] = useState<FilterParams>({});

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // State for sorting
  const [sortBy, setSortBy] = useState('departure_time');
  const [sortOrder, setSortOrder] = useState('ASC');

  // State for search results and loading status
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle basic search form submission
  const handleSearch = (params: JourneySearchParams) => {
    setBasicSearchParams(params);

    // Combine basic search parameters with existing filter parameters
    const combinedParams = {
      ...params,
      ...filterParams,
      sort_by: sortBy,
      sort_order: sortOrder
    };

    setSearchParams(combinedParams);
    setCurrentPage(1); // Reset to first page on new search
    fetchJourneys(combinedParams, 1);
  };

  // Handle filter changes
  const handleFilterChange = (params: FilterParams) => {
    setFilterParams(params);

    // Only trigger a new search if we already have basic search parameters
    if (Object.keys(basicSearchParams).length > 0) {
      const combinedParams = {
        ...basicSearchParams,
        ...params,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      setSearchParams(combinedParams);
      fetchJourneys(combinedParams, currentPage);
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    const updatedParams = {
      ...searchParams,
      sort_by: newSortBy,
      sort_order: newSortOrder
    };

    setSearchParams(updatedParams);
    fetchJourneys(updatedParams, currentPage);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchJourneys(searchParams, page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (itemsCount: number) => {
    setItemsPerPage(itemsCount);
    setCurrentPage(1); // Reset to first page when changing items per page
    fetchJourneys(searchParams, 1, itemsCount);
  };

  // Fetch journeys from API
  const fetchJourneys = async (
    params: JourneySearchParams & FilterParams,
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
      const result = await searchJourneys(apiParams);
      setJourneys(result.journeys);

      // Use the total from the API response
      setTotalItems(result.total);
      setItemsPerPage(result.limit);

    } catch (err) {
      console.error('Error fetching journeys:', err);
      setError('Failed to fetch journeys. Please try again later.');
      setJourneys([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load - optional, can be removed if you don't want to load data on first render
  useEffect(() => {
    fetchJourneys({ sort_by: sortBy, sort_order: sortOrder });
  }, []);

  return (
    <>
      <Header/>

      {/* Hero Section with Search Form */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-900 text-white pt-16" 
           style={{
             backgroundImage: "url('/medium-vecteezy_futuristic-electric-bus.jpg')",
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>

        {/* Content */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Sri Lanka Bus Schedules</h2>
            <p className="text-blue-100 mb-6">Find the perfect route for your journey across the island</p>
          </div>

          {/* Search form inside hero section */}
          <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <SearchSection onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Main content - 2 column layout */}
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - Filter section */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-semibold px-5 pt-5 pb-2">Filter Options</h3>
              <FilterSection 
                onFilterChange={handleFilterChange}
                totalResults={totalItems}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                vertical={true} // New prop for vertical layout
              />
            </div>
          </div>

          {/* Right content - Journey list and pagination */}
          <div className="md:w-3/4">
            {/* Results info and sort section */}
            {totalItems > 0 && (
              <div className="flex justify-between items-center mb-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="font-medium text-gray-700">
                  {totalItems} {totalItems === 1 ? "journey" : "journeys"} found
                </div>

                <div className="flex items-center">
                  <label htmlFor="sort" className="mr-2 text-gray-600 font-medium">Sort by:</label>
                  <select
                    id="sort"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-');
                      handleSortChange(newSortBy, newSortOrder);
                    }}
                    className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="departure_time-ASC">Departure Time</option>
                    <option value="arrival_time-ASC">Arrival Time</option>
                    <option value="fare-ASC">Lowest Fare</option>
                    <option value="fare-DESC">Highest Fare</option>
                    <option value="bus_type-ASC">Bus Type</option>
                  </select>
                </div>
              </div>
            )}

            {/* Journey List */}
            <JourneyList 
              journeys={journeys}
              isLoading={isLoading}
              error={error}
            />

            {/* Pagination */}
            {!isLoading && totalItems > 0 && (
              <div className="mt-6">
                <Pagination 
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Journeys;