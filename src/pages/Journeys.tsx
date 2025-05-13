import { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import Pagination from '../components/shared/Pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JourneyList from '../components/JourneyList';
import { searchJourneys } from '../utils/apiHelper';
import type { Journey } from '../utils/type';

const Journeys = () => {
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
  const [sortBy, setSortBy] = useState('departure_time');
  const [sortOrder, setSortOrder] = useState('ASC');
  
  // State for search results and loading status
  const [journeys, setJourneys] = useState<Journey[]>([]);
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
    await fetchJourneys(updatedParams, 1);
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
    await fetchJourneys(updatedParams, currentPage);
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchJourneys(searchParams, page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = async (itemsCount: number) => {
    setItemsPerPage(itemsCount);
    setCurrentPage(1); // Reset to first page when changing items per page
    await fetchJourneys(searchParams, 1, itemsCount);
  };

  // Fetch journeys from API
  const fetchJourneys = async (
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
      <div className="container mx-auto py-8 px-4">
        <SearchForm 
          onSearch={handleSearch} 
          totalResults={totalItems} 
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
        
        {/* Journey List Component */}
        <JourneyList 
          journeys={journeys}
          isLoading={isLoading}
          error={error}
        />
        
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

export default Journeys;