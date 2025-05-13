import React from 'react';
import ScheduleCard from './ScheduleCard';
import { FaInfoCircle } from 'react-icons/fa';
import type { BusSchedule } from '../utils/type';

interface ScheduleListProps {
  schedules: BusSchedule[];
  isLoading: boolean;
  error: string | null;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ 
  schedules, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="my-8 flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading schedules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl my-8 text-red-800 border border-red-200 flex items-center">
        <FaInfoCircle className="text-red-600 mr-3 flex-shrink-0" size={24} />
        <div>
          <h3 className="font-medium text-red-800 mb-1">Error Loading Schedules</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="my-8 bg-blue-50 p-8 rounded-xl border border-blue-100 text-center">
        <h3 className="font-medium text-blue-800 text-lg mb-2">No Schedules Found</h3>
        <p className="text-blue-700">
          We couldn't find any bus schedules matching your search criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Available Schedules ({schedules.length})
        </h2>
        <div className="text-sm text-gray-600">
          Prices include all taxes and fees
        </div>
      </div>

      <div className="space-y-6">
        {schedules.map((schedule) => (
          <ScheduleCard key={schedule.schedule_id} schedule={schedule} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;