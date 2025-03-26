import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LoginPage from './pages/Login'; // Zorg ervoor dat je de juiste import hebt
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root route die de loginpagina rendert */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
