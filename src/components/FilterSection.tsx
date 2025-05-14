import { useState, useRef, useEffect } from "react";
import {
  FaFilter,
  FaSort,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

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

interface FilterParams {
  operator?: string;
  bus_type?: string;
  days_of_week?: string[];
  departure_time_from?: string;
  departure_time_to?: string;
  arrival_time_from?: string;
  arrival_time_to?: string;
  [key: string]: string | string[] | undefined;
}

// Add a 'vertical' prop to the FilterSectionProps interface
interface FilterSectionProps {
  onFilterChange: (filters: FilterParams) => void;
  totalResults?: number;
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  vertical?: boolean; // New prop for vertical layout
}

const FilterSection = ({
  onFilterChange,
  totalResults = 0,
  sortBy,
  sortOrder,
  onSortChange,
  vertical = false, // Default to horizontal layout
}: FilterSectionProps) => {
  // Filter states
  const [busTypes, setBusTypes] = useState<string[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [departureWindows, setDepartureWindows] = useState<string[]>([]);
  const [arrivalWindows, setArrivalWindows] = useState<string[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Filter visibility states
  const [showFilters, setShowFilters] = useState(true);

  // Dropdown states for desktop view
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Toggle checkbox selections for filters
  const toggleSelection = (
    item: string,
    currentItems: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    let newItems: string[];
    if (currentItems.includes(item)) {
      newItems = currentItems.filter((i) => i !== item);
    } else {
      newItems = [...currentItems, item];
    }

    setItems(newItems);
    applyFilters();
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

  // Apply filters
  const applyFilters = () => {
    const timeRanges = processTimeWindows();

    // Convert to short day format used by the API
    const formattedDaysOfWeek = daysOfWeek.map((day) => day.substring(0, 3));

    // Prepare filter parameters
    const params: FilterParams = {
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

    // Pass filters to parent component
    onFilterChange(params);
  };

  // Reset all filters
  const resetFilters = () => {
    setBusTypes([]);
    setOperators([]);
    setDepartureWindows([]);
    setArrivalWindows([]);
    setDaysOfWeek([]);

    // Clear filters in parent component
    onFilterChange({});
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
    <div className="space-y-4">
      {/* In vertical layout, each filter section is stacked */}
      {vertical ? (
        // Vertical layout for sidebar
        <>
          {/* Operators Section */}
          <div className="py-4 px-5 border-b border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Operators</h4>
            <div className="space-y-2">
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
                    className="ml-2 text-gray-700 text-sm"
                  >
                    {operator}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Bus Types Section */}
          <div className="py-4 px-5 border-b border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Bus Type</h4>
            <div className="space-y-2">
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
                    className="ml-2 text-gray-700 text-sm"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Departure Time Section */}
          <div className="py-4 px-5 border-b border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Departure Time</h4>
            <div className="space-y-2">
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
                    className="ml-2 text-gray-700 text-sm"
                  >
                    {window}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Arrival Time Section */}
          <div className="py-4 px-5 border-b border-gray-100">
            <h4 className="font-medium text-gray-700 mb-3">Arrival Time</h4>
            <div className="space-y-2">
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
                    className="ml-2 text-gray-700 text-sm"
                  >
                    {window}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Days of Week Section */}
          <div className="py-4 px-5">
            <h4 className="font-medium text-gray-700 mb-3">Days of Operation</h4>
            <div className="space-y-2">
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
                    className="ml-2 text-gray-700 text-sm"
                  >
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
            >
              Apply Filters
            </button>
          </div>
        </>
      ) : (
        // Horizontal layout (original code)
        <div className="space-y-6">
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

          {/* Filter UI section */}
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
                          openDropdown === "busType"
                            ? "transform rotate-180"
                            : ""
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
                          <div
                            key={operator}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={`operator-desktop-${operator}`}
                              checked={operators.includes(operator)}
                              onChange={() =>
                                toggleSelection(
                                  operator,
                                  operators,
                                  setOperators
                                )
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
                          openDropdown === "arrival"
                            ? "transform rotate-180"
                            : ""
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
                          openDropdown === "days"
                            ? "transform rotate-180"
                            : ""
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

                  {/* More mobile filters... */}
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
            <div className="flex flex-col sm:flex-row justify-between items-center pt-0 border-t border-gray-200 pt-4">
              <div className="font-medium text-gray-700">
                {totalResults} {totalResults === 1 ? "journey" : "journeys"}{" "}
                found
              </div>

              <div className="flex items-center mt-3 sm:mt-0">
                <FaSort className="mr-2 text-gray-600" />
                <label
                  htmlFor="sort"
                  className="mr-2 text-gray-700 font-medium"
                >
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
        </div>
      )}
    </div>
  );
};

export default FilterSection;