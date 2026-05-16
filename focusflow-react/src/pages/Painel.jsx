import Header from "../components/Header";
import UserTable from "../components/UserTable";
import Footer from "../components/Footer";

function Painel() {
    return (
        <>
        <Header/>
        <main> <h2>Painel Admnistrativo</h2>
        <UserTable/>
        </main>
        <Footer/>
        </>
    );
}
export default Painel;