import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Header from "../Header/Header";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) handleReplace();
  }, [user]);

  const handleReplace = () => {
    navigate('/cadastro-profissional', { replace: true });
  };

  return (
    <div>
      <Header />
      <div className="login-page">
        <div className="login-container">
          <input
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
          <input
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
          <button
            className="login__btn"
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Login
          </button>
          <div>
            Não tem uma conta? <Link to="/registrar-usuario">Cadastre-se</Link> .
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Login;