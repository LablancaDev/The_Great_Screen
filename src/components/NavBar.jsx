import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Context from '../Contexto/Context';

const NavBar = () => {

    const { stateLogin } = useContext(Context);

    const usuario = stateLogin.login.user;

    const closeSession = () => {
        const exitAuth = localStorage.removeItem("user");
        return exitAuth;
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <img className='img-fluid logo me-3' src="../src/assets/imgs/cine.png" alt="claqueta" />
                    <a className="navbar-brand" href="#">The Great Screen</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to={"/moviespage"}>
                                    <a className="nav-link" aria-current="page" href="#">Home</a>
                                </Link>
                            </li>
                            <Link to={"mifilmoteca"}>
                                <li className="nav-item filmoteca"><a className="nav-link" href="#">My film library</a></li>
                            </Link>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Menu
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Popular Movies</a></li>
                                    <li><a className="dropdown-item" href="#">Top Rated Movies</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    <Link to={"/moviespage"}>
                                    <li><a className="dropdown-item text-danger" href="#">Return</a></li>
                                    </Link>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <div className='d-flex justify-content-between align-items-center'>
                                {stateLogin.login.isLoggedIn == true ? (
                                    <>
                                        <button onClick={closeSession} className='btn btn-danger me-2'>Cerrar Sesión</button>
                                        <div className='user p-1 rounded text-warning fw-bold me-2 fs-5'>{usuario}</div>
                                    </>
                                ) : (
                                    <Link to={"/login"}>
                                        <button className="btn btn-outline-primary me-2" type="submit">Login</button>
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavBar