import React from 'react';
import './App.css';
import Cadastro from './Cadastro/Cadastro';
import Login from './Login/Login';
import ListarProfissionais from './ListarProfissionais/ListarProfissionais';
import RegistrarUsuario from './RegistrarUsuario/RegistrarUsuario';
import EditarDados from './EditarDados/EditarDados';
import Historico from './Historico/Historico';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/listar-profissionais" element={<ListarProfissionais />} />
        <Route exact path="/cadastro-profissional" element={<Cadastro />} />
        <Route exact path="/registrar-usuario" element={<RegistrarUsuario />} />
        <Route exact path="/editar-dados/:idProf" element={<EditarDados />} />
        <Route exact path="/listar-profissionais/historico/:idProf" element={<Historico />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
