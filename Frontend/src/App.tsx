import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import { ModeToggle } from './components/mode-toggle'
import './App.css';
import Dashboard from './pages/Dashboard';
import History from './pages/History'
import Team from './pages/Team'
import { ThemeProvider } from './components/theme-provider';
import { Github } from './components/ui/github'

function App() {
  return (
    <ThemeProvider>
    <Router>
    <div className="app-container">
    <header className="header flex space-x-2">
            <Github/>
            <ModeToggle />
          </header>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="team" element={<Team />} />
          </Routes>
        </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
