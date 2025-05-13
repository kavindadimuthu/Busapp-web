import React from 'react';
import { FaBus, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';

interface JourneyHeaderProps {
  busName: string;
  operatorName: string;
  busType: string;
  routeName: string;
}

const JourneyHeader: React.FC<JourneyHeaderProps> = ({ 
  busName, 
  operatorName, 
  busType,
  routeName 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-start flex-wrap">
        <div>
          <div className="flex items-center mb-2">
            <FaBus className="text-2xl mr-2" />
            <h1 className="text-3xl font-bold">{busName}</h1>
            <span className="ml-3 bg-white text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
              {busType}
            </span>
          </div>
          <p className="text-lg text-blue-100">{operatorName}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="flex items-center">
            <FaArrowRight className="text-blue-200 mr-2" />
            <p className="text-xl font-semibold">{routeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyHeader;