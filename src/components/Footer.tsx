import { FaBus, FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 px-4 mt-12">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center mb-4">
              <FaBus className="text-blue-400 text-2xl mr-2" />
              <h3 className="text-xl font-bold">BusConnect</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted companion for bus travel across Sri Lanka. 
              Providing accurate schedules and route information to make your journey seamless.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Routes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Popular Destinations</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Colombo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Kandy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Galle
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Jaffna
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <FaPhoneAlt className="mt-1 mr-3 text-blue-400" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-blue-400" />
                <span>info@busapp.lk</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-400" />
                <span>123 Main Street, Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BusConnect. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;