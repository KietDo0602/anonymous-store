import React, { useState, useMemo } from "react";
import { BrowserRouter, Route} from "react-router-dom";
import {Navbar} from './components/Navbar'
import Home from './components/Home'
import Cart from './components/Cart'
import Register from './Register'
import {Login} from './Login'
import { UserContext } from "./UserContext";

function AppRouter() {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <BrowserRouter>
      <div className="App">
          <UserContext.Provider value={value}>
            <Navbar/>
            <Route exact path="/" component={Home}/>
            <Route path="/cart" component={Cart}/>
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login}/>
          </UserContext.Provider>
      </div>
    </BrowserRouter>
 );
}

export default AppRouter;
