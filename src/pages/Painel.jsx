import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { MateriasProvider } from '../context/MateriasContext';
import './Painel.css';

function Painel() {
  return (
    <MateriasProvider>
      <div className="painel-wrapper">
        <Sidebar />
        <main className="painel-main">
          <Outlet />
        </main>
      </div>
    </MateriasProvider>
  );
}

export default Painel;