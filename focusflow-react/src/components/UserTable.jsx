function UserTable() {
    const usuarios = [
     { id: 1, nome: "João Silva", email: "joao@gmail.com" },
    { id: 2, nome: "Cláudia Santos", email: "claudia@gmail.com" },
    { id: 3, nome: "Maria Oliveira", email: "maria@gmail.com" },
    { id: 4, nome: "Carlos Pereira", email: "carlos@gmail.com" },
    { id: 5, nome: "Eduarda Costa", email: "eduarda@gmail.com" },
  ];
    
  return (
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {usuarios.map((usuario) =>(
                <tr key={usuario.id}> 
                <td>{usuario.id}</td>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                    <button className="btn-editar">Editar</button>
                    <button className="btn-excluir">Excluir</button>
                </td>
                </tr>

            ))}
        </tbody>
    </table>
  );
}
export default UserTable;