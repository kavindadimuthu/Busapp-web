export interface Stop {
  id: string;
  name: string;
  city: string;
  location: string;
  sequence: number;
}

export interface StopTime {
  id: string;
  route_stop_id: string;
  arrival_time: string | null;
  departure_time: string | null;
}

export interface Journey {
  journey_id: string;
  departure_time: string;
  arrival_time: string;
  days_of_week: string[];
  schedule_id: string;
  valid_from: string;
  valid_until: string | null;
  bus_id: string;
  bus_number: string;
  bus_name: string;
  bus_type: string;
  fare: string;
  is_active: boolean;
  operator_id: string;
  operator_name: string;
  contact_info: string;
  route_id: string;
  route_name: string;
  total_distance: number;
  total_duration: number;
  stops: Stop[];
  stop_times: StopTime[];
}

// Pagination response type
export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  [key: string]: any; // For additional data specific to each endpoint
}

export interface JourneyResponse extends PaginatedResponse<Journey> {
  journeys: Journey[];
}