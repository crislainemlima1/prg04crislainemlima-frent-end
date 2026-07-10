import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './painel.css';

function Painel() {
  return (
    <div className="painel-wrapper">
      <Sidebar />
      <main className="painel-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Painel;
