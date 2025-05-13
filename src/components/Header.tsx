import { useState } from 'react';
import { FaBus, FaTimes } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative top-0 z-50 bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      {/* Top navigation bar */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <FaBus className="text-3xl mr-2 text-white" />
            <h1 className="text-2xl font-bold">BusConnect</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a className="hover:text-blue-200 transition-colors font-medium" href="#">Home</a>
            <a className="hover:text-blue-200 transition-colors font-medium" href="#">Routes</a>
            <a className="hover:text-blue-200 transition-colors font-medium" href="#">Schedules</a>
            <a className="hover:text-blue-200 transition-colors font-medium" href="#">Support</a>
            <a className="hover:text-blue-200 transition-colors font-medium" href="#">About</a>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <MdMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden bg-blue-800 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col px-4 pt-2 pb-4 space-y-3">
          <a className="hover:bg-blue-700 py-2 px-3 rounded transition-colors" href="#">Home</a>
          <a className="hover:bg-blue-700 py-2 px-3 rounded transition-colors" href="#">Routes</a>
          <a className="hover:bg-blue-700 py-2 px-3 rounded transition-colors" href="#">Schedules</a>
          <a className="hover:bg-blue-700 py-2 px-3 rounded transition-colors" href="#">Support</a>
          <a className="hover:bg-blue-700 py-2 px-3 rounded transition-colors" href="#">About</a>
        </nav>
      </div>

      {/* Hero section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Sri Lanka Bus Schedules</h2>
          <p className="text-blue-100 mb-6">Find the perfect route for your journey across the island</p>
          
        </div>
      </div>
    </header>
  );
};

export default Header;