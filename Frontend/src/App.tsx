import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { ThemeProvider } from "@/components/theme-provider"
import LoginPage from './pages/Login';
import { ModeToggle } from './components/mode-toggle'
import './App.css';
import Dashboard from './pages/dashboard';
import HistoricData from './pages/historicData'
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider>
    <Router>
    <div className="app-container">
    <header className="header">
            <ModeToggle />
          </header>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="historicData" element={<HistoricData />} />
          </Routes>
        </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
