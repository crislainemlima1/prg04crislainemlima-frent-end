import LoginForm from '../components/LoginForm';
import LoginIlustracao from '../components/LoginIlustracao';
import './Login.css';

function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-lado-esquerdo">
        <LoginIlustracao />
      </div>
      <div className="login-lado-direito">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;