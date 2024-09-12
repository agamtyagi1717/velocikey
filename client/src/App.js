import './App.css';
import Homepage from './pages/Homepage';
import Leaderboard from './pages/Leaderboard';
import Navbar from './pages/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='flex items-center flex-col h-screen'>
        <Navbar /> {/* Shared Navbar */}
        <Routes>
          <Route path='/' element={<Homepage />}/>
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
