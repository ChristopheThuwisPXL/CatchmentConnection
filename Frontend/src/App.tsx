import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/private-routes';
import { ModeToggle } from './components/mode-toggle';
import { ThemeProvider } from './components/theme-provider';
import { Github } from './components/ui/github';
import './App.css';
import LoginPage from './pages/Login';
import Dashboard from './pages/dashboard';
import History from './pages/History';
import Team from './pages/Team';
import Account from './pages/account';
import NotificationPage from './pages/notification';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <header className="header flex space-x-2">
            <Github />
            <ModeToggle />
          </header>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/team" element={<Team />} />
              <Route path="/account" element={<Account />} />
              <Route path="/notification" element={<NotificationPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
