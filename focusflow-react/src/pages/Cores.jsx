import Header from "../components/Header";
import Footer from "../components/Footer";

function Cores(){
    return (
        <>
        <Header/>
        <main>
            <h2>Paleta de Cores</h2>
            <p>Tipo de paleta: Analógica</p>
            <ul>
                 <li>Azul bebê — <span style={{backgroundColor: '#b3e2f7', padding: '0 1rem'}}>#b3e2f7</span></li>
          <li>Lilás — <span style={{backgroundColor: '#C8A2C8', padding: '0 1rem'}}>#C8A2C8</span></li>
          <li>Preto suave — <span style={{backgroundColor: '#1a1a2e', padding: '0 1rem', color: 'white'}}>#1a1a2e</span></li>
            </ul>
        </main>
        <Footer/>
        </>
    );
}
export default Cores;