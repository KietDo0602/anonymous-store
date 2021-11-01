import React from 'react';
import { Link } from 'react-router-dom';


 const Navbar = ()=>{
    return(
            <nav className="nav-wrapper">
                <div className="container">
                    <Link to="/" className="brand-logo">The 116 Tech Shop</Link>

                    <ul className="right">
                        <li className="navDescription"> <Link to="/">Home</Link></li>
                        <li className="navDescription"><Link to="/cart">View Cart</Link></li>
                        <li><Link to="/cart"><i className="material-icons">shopping_cart</i></Link></li>
                        <li><input type="email" id="email" class="form__field" placeholder="Username"></input></li>
                        {/* <li><button className="waves-effect waves-light blue btn">Login</button></li> */}
                        <li className="navDescription login-button"><Link to="/">Login</Link></li>
                    </ul>
                </div>
            </nav>
   
        
    )
}

export default Navbar;