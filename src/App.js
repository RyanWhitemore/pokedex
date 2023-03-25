
import { useState, useEffect } from "react";
import { useNavigate, Route, Routes, BrowserRouter, Navigate, Link } from 'react-router-dom'
const { LoginForm } = require("./login.jsx")
const { Register } = require("./register.jsx")


const checkAuth = async () => {
    const auth = await fetch("http:localhost:5000/auth")
    if (auth) {
        return true
    }
}

const Home = () => {
    const [auth, setAuth] = useState(false)

    useEffect(() => {
        checkAuth().then(
            result => {
                setAuth(result)
                console.log(auth)
            }
        )
    },[])
    return <>logged in</>
}


const App = () => {



    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/login" element={<LoginForm/>}/>
                    <Route exact path="/register" element={<Register/>}/>
                    <Route exact path="/home" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )

    
    
}


export default App