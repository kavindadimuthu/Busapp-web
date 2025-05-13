import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Journeys from './pages/Journeys';
import Journey from './pages/Journey';
// import BusDetail from './pages/BusDetail';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/journeys" element={<Journeys />} />
          {/* <Route path="/bus/:id" element={<BusDetail />} /> */}
          <Route path="/journey/:id" element={<Journey />} />
        </Routes>
      </div>
    </Router>
  );
}
