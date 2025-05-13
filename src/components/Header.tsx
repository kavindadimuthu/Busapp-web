import { FaBus } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 px-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaBus className="text-3xl mr-3" />
            <h1 className="text-3xl font-bold">BusConnect</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a className="hover:text-blue-200 font-medium" href="#">Home</a>
            <a className="hover:text-blue-200 font-medium" href="#">My Bookings</a>
            <a className="hover:text-blue-200 font-medium" href="#">Support</a>
            <a className="hover:text-blue-200 font-medium" href="#">Login</a>
          </nav>
          <button className="md:hidden">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-4xl font-bold mb-2">Find and Book Bus Tickets</h2>
          <p className="text-blue-100">Search through hundreds of routes to find your perfect journey</p>
        </div>
      </div>
    </header>
  );
};

export default Header;