import React from 'react'

import { Link, useNavigate } from 'react-router-dom';

import './LoggedHeader.css';
import LogoImage from '../assets/logo-taugor.png';
import {logout} from '../firebase'

function LoggedHeader() {
    const navigate = useNavigate();
    const sair = () => {
        logout();
        navigate('/', { replace: true })

    }
    return (
        <header>
            <div className="header-items">
                <div>
                    <img src={LogoImage} className="logo-header" alt="logo" />
                </div>
                <div className="header-links">
                    <div style={{marginRight:'35px', paddingLeft:'20px'}}>
                        <Link className="nav-link" to="/listar-profissionais">
                            <span className="nav-text">Profissionais</span>
                        </Link>
                    </div>
                    <div>
                        <Link className="nav-link" to="/cadastro-profissional">
                            <span className="nav-text">Cadastrar Novo</span>
                        </Link>
                    </div>
                </div>
                <div className="btn-container">
                    <button className="btn-logout" onClick={() => sair()}>
                        SAIR
                    </button>
                </div>
            </div>
        </header>
    )
}

export default LoggedHeader;