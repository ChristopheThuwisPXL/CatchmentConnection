import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { ThemeProvider } from "@/components/theme-provider"
import LoginPage from './pages/Login';
//import { ModeToggle } from './components/mode-toggle'
import './App.css';
import Dashboard from './pages/dashboard';
import HistoricData from './pages/historicData'

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="historicData" element={<HistoricData/>}/>
      </Routes>
    </Router>
    
  );
}

export default App;
