import { react, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
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
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='password'></input><br/>
                    <button type="submit">Login</button><br/>
                </form>
                <Link to="/register">register</Link>
            </div>
        </>
    )

}

export {LoginForm}