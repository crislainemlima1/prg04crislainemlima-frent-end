import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home(){
    return (
        <> 
        <Header/>
        <Navbar/>
        <main>
            <p>Bem-vindo ao FocusFlow! Navegue pelas páginas da Plataforma.</p>
        </main>
        <Footer/>
        </>
    );
}
export default Home;