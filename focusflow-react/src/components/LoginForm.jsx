import { useNavigate } from "react-router-dom";

function LoginForm(){
    const navigate = useNavigate();

   function handleSubmit(event) {
        event.preventDefault();
        // Aqui você pode adicionar lógica de autenticação, como verificar as credenciais do usuário
        // Se a autenticação for bem-sucedida, redirecione para o painel
        navigate("/painel");
   }
        return (
            <form id="formLogin" onSubmit={handleSubmit}>
              <label>E-mail</label>  
                <input type="email" placeholder="Digite seu e-mail" required />

                <label>Senha</label>
                <input type="password" placeholder="Digite sua senha" required />

                <button type="submit">Entrar</button>
                <button type="button" onClick={() => alert('Em breve!')}>
        Esqueceu a senha?
             </button>
            </form>
        )
}
export default LoginForm;