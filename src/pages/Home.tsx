import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchSection from '../components/SearchSection';
import type { JourneySearchParams } from '../utils/type';

const Home = () => {

  const handleSearch = (params: JourneySearchParams) => {
    // Navigate to journeys page with search params
    window.location.href = `/journeys?source=${params.source || ''}&destination=${params.destination || ''}&date=${params.date || ''}`;
  };

  // Popular destinations in Sri Lanka
  const popularDestinations = [
    { name: 'Colombo', image: '/cities/colombo.jpg', description: 'Capital city with vibrant culture' },
    { name: 'Kandy', image: '/cities/kandy.jpg', description: 'Historical temple city' },
    { name: 'Galle', image: '/cities/galle.jpg', description: 'Colonial fort city by the coast' },
    { name: 'Nuwara Eliya', image: '/cities/nuwaraeliya.jpg', description: 'Tea country in the highlands' },
  ];

  // App features
  const features = [
    {
      title: 'Real-time Bus Tracking',
      description: 'Know exactly when your bus will arrive with our live tracking system.',
      icon: '🛰️'
    },
    {
      title: 'Online Ticket Booking',
      description: 'Book tickets in advance and secure your seat for a comfortable journey.',
      icon: '🎟️'
    },
    {
      title: 'Route Optimization',
      description: 'Find the fastest and most convenient routes to your destination.',
      icon: '🗺️'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" 
             style={{backgroundImage: "url('/images/hero-bus.jpg')"}}></div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl font-bold mb-4">Travel Across Sri Lanka</h1>
            <p className="text-xl">Find and book the most convenient bus routes</p>
          </div>
          
          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <SearchSection onSearch={handleSearch} simplified={true} />
          </div>
        </div>
      </section>
      
      {/* Popular Destinations Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
                <div className="h-48 bg-gray-300 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <Link 
                    to={`/journeys?destination=${destination.name}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Find Buses
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition bg-gradient-to-b from-gray-50 to-white">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-xl mb-8">Plan your trip now and travel with confidence</p>
          <Link 
            to="/journeys" 
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            Browse All Routes
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;