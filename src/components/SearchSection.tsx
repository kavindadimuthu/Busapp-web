import { useState, useRef, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getStops } from "../utils/apiHelper";
import type { Stop } from "../utils/type";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";

interface SearchSectionProps {
  onSearch: (params: any) => void;
}

const SearchSection = ({ onSearch }: SearchSectionProps) => {
  // Search form state
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [date, setDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stops, setStops] = useState<Stop[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch stops from API
  useEffect(() => {
    const fetchStops = async () => {
      try {
        const stopsData = await getStops();
        setStops(stopsData);
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };
    fetchStops();
  }, []);

  // Dropdown references and states
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const sourceInputRef = useRef<HTMLDivElement>(null);
  const destInputRef = useRef<HTMLDivElement>(null);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);
  const sourceTextInputRef = useRef<HTMLInputElement>(null);
  const destTextInputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const getFormattedDate = () => {
    if (!date) return "";
    try {
      const dateObj = new Date(date);
      return format(dateObj, "MMM dd, yyyy");
    } catch (error) {
      return "";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Source dropdown handling
      if (
        showSourceDropdown &&
        sourceDropdownRef.current &&
        sourceInputRef.current &&
        !sourceDropdownRef.current.contains(event.target as Node) &&
        !sourceInputRef.current.contains(event.target as Node)
      ) {
        setShowSourceDropdown(false);
      }

      // Destination dropdown handling
      if (
        showDestDropdown &&
        destDropdownRef.current &&
        destInputRef.current &&
        !destDropdownRef.current.contains(event.target as Node) &&
        !destInputRef.current.contains(event.target as Node)
      ) {
        setShowDestDropdown(false);
      }

      // Date picker handling
      if (
        showDatePicker &&
        datePickerRef.current &&
        dateContainerRef.current &&
        !datePickerRef.current.contains(event.target as Node) &&
        !dateContainerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSourceDropdown, showDestDropdown, showDatePicker]);

  // Focus on text input when dropdown is shown
  useEffect(() => {
    if (showSourceDropdown && sourceTextInputRef.current) {
      sourceTextInputRef.current.focus();
    }
  }, [showSourceDropdown]);

  useEffect(() => {
    if (showDestDropdown && destTextInputRef.current) {
      destTextInputRef.current.focus();
    }
  }, [showDestDropdown]);

  // Filter stops for the dropdowns
  const getFilteredStops = (query: string) => {
    if (!query) return stops;
    const lowerCaseQuery = query.toLowerCase();
    return stops.filter(
      (stop) =>
        stop.name.toLowerCase().includes(lowerCaseQuery) ||
        stop.city?.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const filteredSourceStops = getFilteredStops(sourceQuery);
  const filteredDestStops = getFilteredStops(destinationQuery);

  // Handle selection of stops
  const selectSourceStop = (stop: Stop) => {
    setSource(stop.id);
    setSourceQuery(stop.name);
    setShowSourceDropdown(false);
  };

  const selectDestStop = (stop: Stop) => {
    setDestination(stop.id);
    setDestinationQuery(stop.name);
    setShowDestDropdown(false);
  };

  // Handle source input change
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSourceQuery(value);
    
    // If input matches a stop exactly, use that stop's ID
    const matchingStop = stops.find(
      stop => stop.name.toLowerCase() === value.toLowerCase()
    );
    
    if (matchingStop) {
      setSource(matchingStop.id);
    } else {
      // If text doesn't match any stop exactly, use the text itself as a query
      setSource(value);
    }
  };

  // Handle destination input change
  const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationQuery(value);
    
    // If input matches a stop exactly, use that stop's ID
    const matchingStop = stops.find(
      stop => stop.name.toLowerCase() === value.toLowerCase()
    );
    
    if (matchingStop) {
      setDestination(matchingStop.id);
    } else {
      // If text doesn't match any stop exactly, use the text itself as a query
      setDestination(value);
    }
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // Keep the date picker open to show the selected date
  };

  // Close date picker after selection is made
  const handleDateSelect = () => {
    setShowDatePicker(false);
  };

  // Swap source and destination
  const swapLocations = () => {
    setSource(destination);
    setDestination(source);
    setSourceQuery(destinationQuery);
    setDestinationQuery(sourceQuery);
  };

  // Navigate through months in calendar
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Set today's date
  const setToday = () => {
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
    setShowDatePicker(false);
  };

  // Clear selected date
  const clearDate = () => {
    setDate("");
    setShowDatePicker(false);
  };

  // Generate calendar days for current month view
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const selectedDate = date ? new Date(date) : null;

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    
    const renderDays = () => {
      return days.map((day, i) => {
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isCurrentDay = isToday(day);
        const formattedDate = format(day, dateFormat);
        const dayStyles = [
          "w-8 h-8 rounded-full grid place-items-center text-sm cursor-pointer",
          !isCurrentMonth && "text-gray-300",
          isCurrentMonth && "text-white",
          isSelected && "bg-blue-500",
          isCurrentDay && !isSelected && "bg-blue-400",
          !isSelected && !isCurrentDay && isCurrentMonth && "hover:bg-blue-300"
        ].filter(Boolean).join(" ");

        return (
          <div 
            key={i} 
            className={dayStyles}
            onClick={() => {
              const formattedDay = format(day, "yyyy-MM-dd");
              setDate(formattedDay);
            }}
          >
            {formattedDate}
          </div>
        );
      });
    };

    return (
      <div className="calendar bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={prevMonth}
            className="text-white hover:text-blue-300"
            aria-label="Previous month"
          >
            <FaChevronLeft />
          </button>
          <div className="text-white font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <button 
            onClick={nextMonth}
            className="text-white hover:text-blue-300"
            aria-label="Next month"
          >
            <FaChevronRight />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((name) => (
            <div key={name} className="text-center text-xs text-gray-300">
              {name}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {renderDays()}
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={setToday}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Today
          </button>
          <button
            type="button"
            onClick={clearDate}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
          >
            Clear
          </button>
        </div>
      </div>
    );
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: any = {};
    
    // Only send the value if it's set
    if (source) params.source = source;
    if (destination) params.destination = destination;
    if (date) params.date = date;

    onSearch(params);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-3 items-end">
        {/* From (Source) Selection */}
        <div className="md:col-span-3 relative" ref={sourceInputRef}>
          <div className="flex items-center w-full px-4 py-3 bg-white/90 rounded-xl transition-all hover:bg-white">
            <FaMapMarkerAlt className="text-blue-500 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-500">From</div>
              <input
                type="text"
                value={sourceQuery}
                onChange={handleSourceChange}
                onClick={() => setShowSourceDropdown(true)}
                placeholder="Select or type departure"
                className="w-full bg-transparent focus:outline-none font-medium text-black"
              />
            </div>
          </div>
          
          {showSourceDropdown && (
            <div 
              ref={sourceDropdownRef}
              className="absolute z-20 mt-1 w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
            >
              <div className="p-2">
                <input
                  ref={sourceTextInputRef}
                  type="text"
                  value={sourceQuery}
                  onChange={handleSourceChange}
                  placeholder="Search cities..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredSourceStops.length > 0 ? (
                  filteredSourceStops.map((stop) => (
                    <div
                      key={stop.id}
                      onClick={() => selectSourceStop(stop)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <div className="font-medium">{stop.name}</div>
                      {stop.city && (
                        <div className="text-xs text-gray-500">{stop.city}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 italic">
                    No exact matches. Your text will be used for search.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Swap Icon */}
        <div className="md:col-span-1 h-full flex justify-center items-center">
          <button
            type="button"
            onClick={swapLocations}
            className="bg-white/90 p-3 rounded-full hover:bg-white shadow-md hover:shadow-lg transition-all"
          >
            <FaExchangeAlt className="text-blue-500" />
          </button>
        </div>

        {/* To (Destination) Selection */}
        <div className="md:col-span-3 relative" ref={destInputRef}>
          <div className="flex items-center w-full px-4 py-3 bg-white/90 rounded-xl transition-all hover:bg-white">
            <FaMapMarkerAlt className="text-blue-500 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium text-blue-500">To</div>
              <input
                type="text"
                value={destinationQuery}
                onChange={handleDestChange}
                onClick={() => setShowDestDropdown(true)}
                placeholder="Select or type destination"
                className="w-full bg-transparent focus:outline-none font-medium text-black"
              />
            </div>
          </div>
          
          {showDestDropdown && (
            <div 
              ref={destDropdownRef}
              className="absolute z-20 mt-1 w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
            >
              <div className="p-2">
                <input
                  ref={destTextInputRef}
                  type="text"
                  value={destinationQuery}
                  onChange={handleDestChange}
                  placeholder="Search cities..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredDestStops.length > 0 ? (
                  filteredDestStops.map((stop) => (
                    <div
                      key={stop.id}
                      onClick={() => selectDestStop(stop)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      <div className="font-medium">{stop.name}</div>
                      {stop.city && (
                        <div className="text-xs text-gray-500">{stop.city}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 italic">
                    No exact matches. Your text will be used for search.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date Selector - Enhanced Version */}
        <div className="md:col-span-2 relative" ref={dateContainerRef}>
          <div 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center w-full px-4 py-3 bg-white/90 rounded-xl hover:bg-white cursor-pointer transition-all"
          >
            <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
            <div className="flex-1 ml-3">
              <div className="text-xs font-medium text-blue-500">Departure Date</div>
              <div className={`font-medium ${!date ? 'text-gray-400' : 'text-black'}`}>
                {getFormattedDate() || "Select date"}
              </div>
            </div>
          </div>
          
          {/* Modern Calendar Date Picker */}
          {showDatePicker && (
            <div 
              ref={datePickerRef}
              className="absolute z-20 mt-1 right-0 bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700 w-72"
            >
              {renderCalendarDays()}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="md:col-span-1 h-full">
          <button
            type="submit"
            className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FaSearch className="mx-auto text-2xl" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchSection;