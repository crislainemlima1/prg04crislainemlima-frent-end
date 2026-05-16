import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";

function Login(){
    return(
        <>
        <Header/>
        <main>
            <LoginForm/>
        </main>
        <Footer/>
        </>
    );
}
export default Login;