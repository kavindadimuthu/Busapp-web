import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBus, FaTimes } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change header styling
  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled past hero section (approx 200px)
      const scrolled = window.scrollY > 200;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 
      ${isScrolled 
        ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg' 
        : 'bg-transparent text-white'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            {/* <FaBus className={`text-3xl mr-2 ${isScrolled ? 'text-white' : 'text-white'}`} /> */}
            <h1 className="text-2xl font-bold relative mr-[-10px]">Buz</h1>
            <img src="/silhouette-bus-trans.png" alt="" className='w-20 h-20' />
            <h1 className="text-2xl font-bold ml-[-8px]">zer</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link className={`hover:${isScrolled ? 'text-blue-700' : 'text-blue-200'} transition-colors font-medium`} to="/">Home</Link>
            <Link className={`hover:${isScrolled ? 'text-blue-700' : 'text-blue-200'} transition-colors font-medium`} to="/journeys">Routes</Link>
            <Link className={`hover:${isScrolled ? 'text-blue-700' : 'text-blue-200'} transition-colors font-medium`} to="#">Schedules</Link>
            <Link className={`hover:${isScrolled ? 'text-blue-700' : 'text-blue-200'} transition-colors font-medium`} to="#">Support</Link>
            <Link className={`hover:${isScrolled ? 'text-blue-700' : 'text-blue-200'} transition-colors font-medium`} to="#">About</Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className={`md:hidden flex items-center ${isScrolled ? 'text-blue-700' : 'text-white'}`}
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
      <div className={`md:hidden ${isScrolled ? 'bg-white text-blue-900' : 'bg-blue-800 text-white'} ${isMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col px-4 pt-2 pb-4 space-y-3">
          <Link className={`hover:${isScrolled ? 'bg-blue-100' : 'bg-blue-700'} py-2 px-3 rounded transition-colors`} to="/">Home</Link>
          <Link className={`hover:${isScrolled ? 'bg-blue-100' : 'bg-blue-700'} py-2 px-3 rounded transition-colors`} to="/journeys">Routes</Link>
          <Link className={`hover:${isScrolled ? 'bg-blue-100' : 'bg-blue-700'} py-2 px-3 rounded transition-colors`} to="#">Schedules</Link>
          <Link className={`hover:${isScrolled ? 'bg-blue-100' : 'bg-blue-700'} py-2 px-3 rounded transition-colors`} to="#">Support</Link>
          <Link className={`hover:${isScrolled ? 'bg-blue-100' : 'bg-blue-700'} py-2 px-3 rounded transition-colors`} to="#">About</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;