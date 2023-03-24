
import { useState } from "react";
import { useNavigate, Route, Routes, BrowserRouter, Navigate, Link } from 'react-router-dom'







const Home = () => {
   return <>logged in</>
}




const Login = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


     const loginUser = async (e) => {
        e.preventDefault();

        let body = new URLSearchParams();
        body.append('username', username);
        body.append('password', password);
    
        const requestOptions = {
           method: "POST",
            headers: {"Accept": "application/x-www-form-urlencoded", "Content-Type": "application/x-www-form-urlencoded"},
            body: body
       };
        const loggedIn = await fetch("http://localhost:5000/login", requestOptions)
                                .then((response) => {return response.json()});
        if (loggedIn === true) {
            return navigate("/home")
        } else {
            console.log(loggedIn)
        }
       
    } 


    return (
        <>
            <div>
                <form onSubmit={loginUser}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type='text'></input><br/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='text'></input><br/>
                    <button type="submit">Login</button><br/>
                </form>
                <Link to="/register">register</Link>
            </div>
        </>
    )

}



const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    let registerUser = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {"Accept": "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            }),
            mode: "no-cors"
        };
        await fetch('http://localhost:5000/register', requestOptions);
        
        navigate('/login')
    }
    


    return (
        <>
            <div>
                <form onSubmit={registerUser}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type='text'></input><br/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='text'></input><br/>
                    <button type="submit">Register</button><br/>
                </form>
                <Link to="/login">Login</Link>
            </div>
        </>
    )
}




const App = () => {



    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/login" element={<Login/>}/>
                    <Route exact path="/register" element={<Register/>}/>
                    <Route exact path="/home" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )

    
    
}


export default App