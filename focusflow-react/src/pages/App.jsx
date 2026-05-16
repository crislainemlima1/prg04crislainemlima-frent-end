import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Cores from './pages/Cores';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/cores" element={<Cores />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;