import React from 'react';
import { FaBus, FaMoneyBillWave, FaPhoneAlt, FaIdCard, FaCheckCircle } from 'react-icons/fa';

interface BusInfoProps {
  busNumber: string;
  busName: string;
  busType: string;
  operatorName: string;
  contactInfo: string;
  fare: string;
}

const BusInfo: React.FC<BusInfoProps> = ({ 
  busNumber, 
  busName, 
  busType, 
  operatorName, 
  contactInfo, 
  fare 
}) => {
  // Define amenities based on bus type
  const getAmenities = () => {
    const baseAmenities = [
      {icon: <FaCheckCircle className="text-green-500" />, name: "Clean Interior"},
      {icon: <FaCheckCircle className="text-green-500" />, name: "Comfortable Seats"},
      {icon: <FaCheckCircle className="text-green-500" />, name: "Large Windows"}
    ];
    
    if (busType === 'AC') {
      return [
        {icon: <FaCheckCircle className="text-green-500" />, name: "Air Conditioning"},
        ...baseAmenities
      ];
    }
    
    return baseAmenities;
  };
  
  const amenities = getAmenities();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaBus className="mr-2 text-blue-600" /> Bus Information
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaIdCard className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bus Number</p>
                <p className="font-semibold">{busNumber}</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaBus className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bus Name</p>
                <p className="font-semibold">{busName}</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaIdCard className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bus Type</p>
                <p className="font-semibold">{busType}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaIdCard className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Operator</p>
                <p className="font-semibold">{operatorName}</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaPhoneAlt className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-semibold">{contactInfo}</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FaMoneyBillWave className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fare</p>
                <p className="font-semibold">{fare} LKR</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-2">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity, index) => (
            <span 
              key={index}
              className="bg-green-50 text-green-800 text-xs flex items-center px-3 py-1.5 rounded-full"
            >
              {amenity.icon}
              <span className="ml-1">{amenity.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusInfo;