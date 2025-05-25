import React from 'react';
import JourneyCard from './JourneyCard';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import type { Journey } from '../utils/type';

interface JourneyListProps {
  journeys: Journey[];
  isLoading: boolean;
  error: string | null;
}

const JourneyList: React.FC<JourneyListProps> = ({ 
  journeys, 
  isLoading, 
  error 
}) => {
  if (isLoading) {
    return (
      <div className="my-8 flex flex-col items-center justify-center py-10">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">Loading journeys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <div className="my-8 bg-blue-50 p-8 rounded-xl border border-blue-100 text-center">
        <h3 className="font-medium text-blue-800 text-lg mb-2">No Journeys Found</h3>
        <p className="text-blue-700">
          We couldn't find any bus journeys matching your search criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="space-y-6">
        {journeys.map((journey) => (
          <JourneyCard key={journey.journey_id} journey={journey} />
        ))}
      </div>
    </div>
  );
};

export default JourneyList;