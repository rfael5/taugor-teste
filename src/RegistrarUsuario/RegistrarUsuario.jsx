import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { auth, registerWithEmailAndPassword } from "../firebase";
import "./RegistrarUsuario.css";
function RegistrarUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  const register = () => {
    if (!nome) alert("O campo nome é obrigatório");
    registerWithEmailAndPassword(nome, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) handleReplace();
  }, [user, loading]);

  const handleReplace = () => {
    navigate('/cadastro-profissional', { replace: true });
  };

  return (
    <div>
      <Header />
      <div className="registro-page">
      
      <div className="registro-container">
        <input
          type="text"
          className="register__textBox"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <button className="register__btn" onClick={register}>
          Cadastrar
        </button>
        <div>
          Já é cadastrado? <Link to="/">Login</Link>.
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default RegistrarUsuario;