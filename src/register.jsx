import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

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


export { Register }