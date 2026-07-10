import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Painel from './pages/painel';
import Dashboard from './components/Dashboard';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/painel/*" element={<Painel />}>
          <Route index element={<Dashboard />} />
          <Route path="timer" element={<PomodoroTimer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
