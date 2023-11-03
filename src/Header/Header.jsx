import React from 'react'

import { Link, useNavigate } from 'react-router-dom';

import './Header.css';
import LogoImage from '../assets/logo-taugor.png';
import {logout} from '../firebase'

function Header() {
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
                    <div style={{marginRight:'20px'}}>
                        <Link className="nav-link" to="/">Login</Link>
                    </div>
                    <div>
                        <Link className="nav-link" to="/registrar-usuario">Cadastrar Usuário</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;

