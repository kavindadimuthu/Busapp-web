const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">BusConnect</h3>
          <p className="text-gray-400 text-sm">
            The easiest way to book bus tickets online.
            Travel with comfort and convenience.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Email: support@busconnect.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Transit Street, Bus City</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-4 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} BusConnect. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;