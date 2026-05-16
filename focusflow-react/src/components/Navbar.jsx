import { Link } from "react-router-dom";

function Navbar(){
    return (
        <nav id="menu">
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/painel">Painel</Link></li>
                <li><Link to="/cores">Cores do Projeto</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;