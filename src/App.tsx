import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import BusDetail from './pages/BusDetail';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/bus/:id" element={<BusDetail />} /> */}
        </Routes>
      </div>
    </Router>
  );
}
