import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "../UserContext"

export function Navbar() {
    const { user, setUser } = useContext(UserContext);
    return(
        <nav className="nav-wrapper">
            <div className="container">
                <Link to="/" className="brand-logo">The 116 Tech Shop</Link>
                <ul className="right">
                    <li className="navDescription"> <Link to="/">Home</Link></li>
                    <li className="navDescription"><Link to="/cart">View Cart</Link></li>
                    <li><Link to="/cart"><i className="material-icons">shopping_cart</i></Link></li>
                    {user ?  <li className="navDescription login-button"> <Link to="/">{user.username}</Link> </li> : <li className="navDescription login-button"><Link to="/register">Register</Link></li>}
                    {user ?  <li className="navDescription login-button" onClick={() => {
                        window.location.reload().then(()=> {
                            setUser(null);
                        })
                    }}><Link to="/">Logout</Link></li> : <li className="navDescription login-button"><Link to="/login">Login</Link></li>}
                </ul>
            </div>
        </nav> 
    )
}