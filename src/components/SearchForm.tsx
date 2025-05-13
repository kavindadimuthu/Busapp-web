import { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import { getStops } from "../utils/apiHelper";
import type { Stop } from "../utils/type";

// Sort options updated for the journey endpoint fields
const SORT_OPTIONS = [
  { value: "departure_time", label: "Departure Time", order: "ASC" },
  { value: "arrival_time", label: "Arrival Time", order: "ASC" },
  { value: "fare", label: "Lowest Fare", order: "ASC" },
  { value: "fare", label: "Highest Fare", order: "DESC" },
  { value: "bus_type", label: "Bus Type", order: "ASC" },
  { value: "operator_name", label: "Operator Name", order: "ASC" },
  { value: "route_name", label: "Route Name", order: "ASC" },
];

// Mock data for dropdowns (could be replaced with API data)
const MOCK_OPERATORS = [
  "National Transport Board",
  "Highway Express",
  "Island Routes",
  "Ceylon Travel",
  "Coastal Lines",
  "Mountain Movers",
  "ABC Travels",
];

const BUS_TYPES = ["AC", "Non-AC", "Express", "Local"];
const TIME_WINDOWS = [
  "12 AM - 6 AM",
  "6 AM - 12 PM",
  "12 PM - 6 PM",
  "6 PM - 12 AM",
];
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Helper function to convert time window to actual time ranges
const timeWindowToRange = (window: string) => {
  switch (window) {
    case "12 AM - 6 AM":
      return { from: "00:00:00", to: "06:00:00" };
    case "6 AM - 12 PM":
      return { from: "06:00:00", to: "12:00:00" };
    case "12 PM - 6 PM":
      return { from: "12:00:00", to: "18:00:00" };
    case "6 PM - 12 AM":
      return { from: "18:00:00", to: "23:59:59" };
    default:
      return { from: "", to: "" };
  }
};

interface SearchFormProps {
  onSearch: (params: any) => void;
  totalResults?: number;
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

const SearchForm = ({
  onSearch,
  totalResults = 0,
  sortBy,
  sortOrder,
  onSortChange,
}: SearchFormProps) => {
  // Search form state
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [date, setDate] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Stops data from API
  const [stops, setStops] = useState<Stop[]>([]);

  // Autocomplete dropdown state
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  const destDropdownRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [busTypes, setBusTypes] = useState<string[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [departureWindows, setDepartureWindows] = useState<string[]>([]);
  const [arrivalWindows, setArrivalWindows] = useState<string[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);

  // Filter visibility states - show by default on desktop
  const [showFilters, setShowFilters] = useState(true);

  // Dropdown states for desktop view
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Check if mobile layout
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setShowFilters(!isMobileView); // Show filters by default only on desktop
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // For filter dropdowns
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }

      // For source autocomplete dropdown
      if (
        showSourceDropdown &&
        sourceDropdownRef.current &&
        sourceInputRef.current &&
        !sourceDropdownRef.current.contains(event.target as Node) &&
        !sourceInputRef.current.contains(event.target as Node)
      ) {
        setShowSourceDropdown(false);
      }

      // For destination autocomplete dropdown
      if (
        showDestDropdown &&
        destDropdownRef.current &&
        destInputRef.current &&
        !destDropdownRef.current.contains(event.target as Node) &&
        !destInputRef.current.contains(event.target as Node)
      ) {
        setShowDestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, showSourceDropdown, showDestDropdown]);

  // Filter stops based on search query
  const getFilteredStops = (query: string) => {
    if (!query) return stops;

    const lowerCaseQuery = query.toLowerCase();
    return stops.filter(
      (stop) =>
        stop.name.toLowerCase().includes(lowerCaseQuery) ||
        stop.city?.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // Filtered stops for source and destination
  const filteredSourceStops = getFilteredStops(sourceQuery);
  const filteredDestStops = getFilteredStops(destinationQuery);

  // Select a stop for source
  const selectSourceStop = (stop: Stop) => {
    setSource(stop.id); // Use the stop ID for the API
    setSourceQuery(stop.name); // But show the name in the input
    setShowSourceDropdown(false);
  };

  // Select a stop for destination
  const selectDestStop = (stop: Stop) => {
    setDestination(stop.id); // Use the stop ID for the API
    setDestinationQuery(stop.name); // But show the name in the input
    setShowDestDropdown(false);
  };

  // Source input change handler
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSourceQuery(value);
    setSource(value); // This will be overwritten with ID if a stop is selected
    setShowSourceDropdown(true);
  };

  // Destination input change handler
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationQuery(value);
    setDestination(value); // This will be overwritten with ID if a stop is selected
    setShowDestDropdown(true);
  };

  // Clear source input
  const clearSource = () => {
    setSource("");
    setSourceQuery("");
  };

  // Clear destination input
  const clearDestination = () => {
    setDestination("");
    setDestinationQuery("");
  };

  // Toggle checkbox selections for filters
  const toggleSelection = (
    item: string,
    currentItems: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentItems.includes(item)) {
      setItems(currentItems.filter((i) => i !== item));
    } else {
      setItems([...currentItems, item]);
    }
  };

  // Process departure and arrival time windows to API format
  const processTimeWindows = () => {
    let departure_time_from = "";
    let departure_time_to = "";
    let arrival_time_from = "";
    let arrival_time_to = "";

    if (departureWindows.length > 0) {
      // Find earliest departure time from selected windows
      const earliestDeparture = departureWindows
        .map((window) => timeWindowToRange(window).from)
        .sort()[0];

      // Find latest departure time from selected windows
      const latestDeparture = departureWindows
        .map((window) => timeWindowToRange(window).to)
        .sort()
        .reverse()[0];

      departure_time_from = earliestDeparture;
      departure_time_to = latestDeparture;
    }

    if (arrivalWindows.length > 0) {
      // Find earliest arrival time from selected windows
      const earliestArrival = arrivalWindows
        .map((window) => timeWindowToRange(window).from)
        .sort()[0];

      // Find latest arrival time from selected windows
      const latestArrival = arrivalWindows
        .map((window) => timeWindowToRange(window).to)
        .sort()
        .reverse()[0];

      arrival_time_from = earliestArrival;
      arrival_time_to = latestArrival;
    }

    return {
      departure_time_from,
      departure_time_to,
      arrival_time_from,
      arrival_time_to,
    };
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const timeRanges = processTimeWindows();

    // Convert to short day format used by the API
    const formattedDaysOfWeek = daysOfWeek.map((day) => day.substring(0, 3));

    // Prepare search parameters for API
    const params: any = {
      source: source || undefined,
      destination: destination || undefined,
      date: date || undefined,
      operator: operators.length > 0 ? operators[0] : undefined,
      bus_type: busTypes.length > 0 ? busTypes[0] : undefined,
      days_of_week:
        formattedDaysOfWeek.length > 0 ? formattedDaysOfWeek : undefined,
      ...timeRanges,
    };

    // Filter out undefined values
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    console.log("Search params:", params);

    // Call the onSearch callback with the parameters
    onSearch(params);
  };

  // Reset all filters
  const resetFilters = () => {
    setBusTypes([]);
    setOperators([]);
    setDepartureWindows([]);
    setArrivalWindows([]);
    setDaysOfWeek([]);
  };

  // Toggle dropdown on desktop
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Get selected filter count
  const getFilterCount = (filterArray: string[]) => {
    return filterArray.length ? `(${filterArray.length})` : "";
  };

  // Count total applied filters
  const getTotalFiltersCount = () => {
    return (
      busTypes.length +
      operators.length +
      departureWindows.length +
      arrivalWindows.length +
      daysOfWeek.length
    );
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptionValue = e.target.value;
    const selectedOption = SORT_OPTIONS.find(
      (option) =>
        option.value === selectedOptionValue.split("-")[0] &&
        option.order === selectedOptionValue.split("-")[1]
    );

    if (selectedOption) {
      onSortChange(selectedOption.value, selectedOption.order);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-8 border border-gray-100">
      {/* Main Search Form */}
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Source - Autocomplete Input */}
          <div className="relative">
            <label
              htmlFor="source"
              className="block text-gray-700 font-medium mb-1"
            >
              From
            </label>
            <div className="relative">
              <input
                ref={sourceInputRef}
                type="text"
                id="source"
                placeholder="Enter source location"
                value={sourceQuery}
                onChange={handleSourceChange}
                onFocus={() => setShowSourceDropdown(true)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              />
              {sourceQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearSource}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Source Autocomplete Dropdown */}
            {showSourceDropdown && (
              <div
                ref={sourceDropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredSourceStops.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No locations found
                  </div>
                ) : (
                  filteredSourceStops.map((stop) => (
                    <div
                      key={stop.id}
                      onClick={() => selectSourceStop(stop)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    >
                      <div className="font-medium">{stop.name}</div>
                      {stop.city && (
                        <div className="text-xs text-gray-500">{stop.city}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Destination - Autocomplete Input */}
          <div className="relative">
            <label
              htmlFor="destination"
              className="block text-gray-700 font-medium mb-1"
            >
              To
            </label>
            <div className="relative">
              <input
                ref={destInputRef}
                type="text"
                id="destination"
                placeholder="Enter destination location"
                value={destinationQuery}
                onChange={handleDestinationChange}
                onFocus={() => setShowDestDropdown(true)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              />
              {destinationQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearDestination}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Destination Autocomplete Dropdown */}
            {showDestDropdown && (
              <div
                ref={destDropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredDestStops.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No locations found
                  </div>
                ) : (
                  filteredDestStops.map((stop) => (
                    <div
                      key={stop.id}
                      onClick={() => selectDestStop(stop)}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    >
                      <div className="font-medium">{stop.name}</div>
                      {stop.city && (
                        <div className="text-xs text-gray-500">{stop.city}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-gray-700 font-medium mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Filter Toggle Section */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <FaFilter className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {getTotalFiltersCount() > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {getTotalFiltersCount()}
              </span>
            )}
            {showFilters ? (
              <FaChevronUp className="ml-1" />
            ) : (
              <FaChevronDown className="ml-1" />
            )}
          </button>

          {getTotalFiltersCount() > 0 && showFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Reset All
            </button>
          )}
        </div>

        {/* The filter UI section remains the same - it's already quite long and doesn't need changes */}
        {showFilters && (
          <div className="">
            {/* Desktop view - filters in a single row */}
            {!isMobile && (
              <div className="grid grid-cols-5 gap-4">
                {/* Bus Type Filter */}
                <div
                  ref={(el) => (dropdownRefs.current["busType"] = el)}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown("busType")}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium">
                      Bus Type {getFilterCount(busTypes)}
                    </span>
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        openDropdown === "busType" ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "busType" && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2">
                      {BUS_TYPES.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`type-${type}`}
                            checked={busTypes.includes(type)}
                            onChange={() =>
                              toggleSelection(type, busTypes, setBusTypes)
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="ml-2 text-gray-700"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Operator Filter */}
                <div
                  ref={(el) => (dropdownRefs.current["operator"] = el)}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown("operator")}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium">
                      Operator {getFilterCount(operators)}
                    </span>
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        openDropdown === "operator"
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "operator" && (
                    <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3 max-h-60 overflow-y-auto">
                      {MOCK_OPERATORS.map((operator) => (
                        <div key={operator} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`operator-desktop-${operator}`}
                            checked={operators.includes(operator)}
                            onChange={() =>
                              toggleSelection(operator, operators, setOperators)
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`operator-desktop-${operator}`}
                            className="ml-2 text-gray-700 text-sm"
                          >
                            {operator}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Departure Time Filter */}
                <div
                  ref={(el) => (dropdownRefs.current["departure"] = el)}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown("departure")}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-sm">
                      Departure {getFilterCount(departureWindows)}
                    </span>
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        openDropdown === "departure"
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "departure" && (
                    <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2">
                      {TIME_WINDOWS.map((window) => (
                        <div key={window} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`departure-desktop-${window}`}
                            checked={departureWindows.includes(window)}
                            onChange={() =>
                              toggleSelection(
                                window,
                                departureWindows,
                                setDepartureWindows
                              )
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`departure-desktop-${window}`}
                            className="ml-2 text-gray-700 text-sm"
                          >
                            {window}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrival Time Filter */}
                <div
                  ref={(el) => (dropdownRefs.current["arrival"] = el)}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown("arrival")}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-sm">
                      Arrival {getFilterCount(arrivalWindows)}
                    </span>
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        openDropdown === "arrival" ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "arrival" && (
                    <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2">
                      {TIME_WINDOWS.map((window) => (
                        <div key={window} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`arrival-desktop-${window}`}
                            checked={arrivalWindows.includes(window)}
                            onChange={() =>
                              toggleSelection(
                                window,
                                arrivalWindows,
                                setArrivalWindows
                              )
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`arrival-desktop-${window}`}
                            className="ml-2 text-gray-700 text-sm"
                          >
                            {window}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Days Filter */}
                <div
                  ref={(el) => (dropdownRefs.current["days"] = el)}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown("days")}
                    className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-medium text-sm">
                      Days {getFilterCount(daysOfWeek)}
                    </span>
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        openDropdown === "days" ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "days" && (
                    <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2">
                      {WEEKDAYS.map((day) => (
                        <div key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`day-desktop-${day}`}
                            checked={daysOfWeek.includes(day)}
                            onChange={() =>
                              toggleSelection(day, daysOfWeek, setDaysOfWeek)
                            }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`day-desktop-${day}`}
                            className="ml-2 text-gray-700 text-sm"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile view - Expanded filters */}
            {isMobile && (
              <div className="space-y-6">
                {/* Bus Type Filter */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-3">Bus Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {BUS_TYPES.map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          checked={busTypes.includes(type)}
                          onChange={() =>
                            toggleSelection(type, busTypes, setBusTypes)
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="ml-2 text-gray-700"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operators Filter */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Bus Operator
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {MOCK_OPERATORS.map((operator) => (
                      <div key={operator} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`operator-${operator}`}
                          checked={operators.includes(operator)}
                          onChange={() =>
                            toggleSelection(operator, operators, setOperators)
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`operator-${operator}`}
                          className="ml-2 text-gray-700"
                        >
                          {operator}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departure Time Window */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Departure Time
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_WINDOWS.map((window) => (
                      <div key={window} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`departure-${window}`}
                          checked={departureWindows.includes(window)}
                          onChange={() =>
                            toggleSelection(
                              window,
                              departureWindows,
                              setDepartureWindows
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`departure-${window}`}
                          className="ml-2 text-gray-700"
                        >
                          {window}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrival Time Window */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Arrival Time
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_WINDOWS.map((window) => (
                      <div key={window} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`arrival-${window}`}
                          checked={arrivalWindows.includes(window)}
                          onChange={() =>
                            toggleSelection(
                              window,
                              arrivalWindows,
                              setArrivalWindows
                            )
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`arrival-${window}`}
                          className="ml-2 text-gray-700"
                        >
                          {window}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Days of Operation */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Days of Operation
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {WEEKDAYS.map((day) => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={daysOfWeek.includes(day)}
                          onChange={() =>
                            toggleSelection(day, daysOfWeek, setDaysOfWeek)
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`day-${day}`}
                          className="ml-2 text-gray-700"
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Count and Sort Section */}
        {totalResults > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center pt-0">
            <div className="font-medium text-gray-700">
              {totalResults} {totalResults === 1 ? "journey" : "journeys"} found
            </div>

            <div className="flex items-center mt-3 sm:mt-0">
              <FaSort className="mr-2 text-gray-600" />
              <label htmlFor="sort" className="mr-2 text-gray-700 font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                className="border border-gray-200 rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={`${option.value}-${option.order}`}
                    value={`${option.value}-${option.order}`}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;
