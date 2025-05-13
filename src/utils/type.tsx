export interface Stop {
  id: string;
  name: string;
  city: string;
  location?: string;
}

export interface ScheduleTime {
  id: string;
  departure_time: string;
  arrival_time: string;
}

export interface BusSchedule {
  schedule_id: string;
  valid_from: string;
  valid_until: string;
  days_of_week: string[];
  bus_id: string;
  bus_number: string;
  bus_name: string;
  bus_type: string;
  fare: string;
  active: boolean;
  operator_id: string;
  operator_name: string;
  contact_info: string;
  route_id: string;
  route_name: string;
  total_distance: number;
  total_duration: number;
  source_stop_id: string;
  source_stop_name: string;
  source_stop_city: string;
  destination_stop_id: string;
  destination_stop_name: string;
  destination_stop_city: string;
  stops: Stop[];
  times: ScheduleTime[];
}

export interface SchedulesResponse {
  schedules: BusSchedule[];
}