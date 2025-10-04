import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Events from './pages/Events/Events';
import Technical from './pages/Events/Technical';
import NonTechnical from './pages/Events/NonTechnical';
import Special from './pages/Events/Special';
import Workshop from './pages/Workshop';
import Accommodation from './pages/Accommodation';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Auth/Profile';
import ForgotPassword from './pages/Auth/ForgotPassword';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EventManagement from './pages/Admin/EventManagement';
import UserManagement from './pages/Admin/UserManagement';
import PaymentVerification from './pages/Admin/PaymentVerification';
import QRScannerPage from './pages/Admin/QRScannerPage';
import Maintenance from './pages/Maintenance';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/technical" element={<Technical />} />
              <Route path="/events/non-technical" element={<NonTechnical />} />
              <Route path="/events/special" element={<Special />} />
              <Route path="/workshops" element={<Workshop />} />
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Authentication Routes - Redirected to Maintenance */}
              <Route path="/login" element={<Maintenance />} />
              <Route path="/register" element={<Maintenance />} />
              <Route path="/forgot-password" element={<Maintenance />} />
              <Route path="/profile" element={<Maintenance />} />
              
              {/* Admin Routes - Redirected to Maintenance */}
              <Route path="/admin" element={<Maintenance />} />
              <Route path="/admin/events" element={<Maintenance />} />
              <Route path="/admin/users" element={<Maintenance />} />
              <Route path="/admin/payments" element={<Maintenance />} />
              <Route path="/admin/scanner" element={<Maintenance />} />
              
              {/* Maintenance Route */}
              <Route path="/maintenance" element={<Maintenance />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
