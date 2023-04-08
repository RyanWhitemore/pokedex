
import { useState, useEffect } from "react";
import { useNavigate, Route, Routes, BrowserRouter, Navigate, Link } from 'react-router-dom'
const { LoginForm } = require("./login.jsx")
const { Register } = require("./register.jsx")
const { Home } = require('./Home.jsx')
const { Profile } = require('./Profile.jsx')



const App = () => {

    const [user, setUser] = useState({})

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<LoginForm setUser={setUser} user={user}/>}/>
                    <Route exact path="/register" element={<Register/>}/>
                    <Route exact path="/home" element={<Home setUser={setUser} user={user}/>}/>
                    <Route exact path="/profile" element={<Profile/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )

    
    
}


export default App