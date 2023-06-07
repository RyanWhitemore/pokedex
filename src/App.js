
import { useState } from "react";
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import AboutPage from "./About.jsx";
import { LoginForm } from "./login.jsx";
import { Register } from "./register.jsx";
import { Home } from "./Home.jsx";
import { Profile } from "./Profile.jsx";



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
                    <Route exact path="/about" element={<AboutPage/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )

    
    
}


export default App