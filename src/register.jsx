import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    let registerUser = async (e) => {
        e.preventDefault();

        const body = {
            username: username,
            password: password
        }

        axios.defaults.baseURL = ''
        await axios.post("http://localhost:5000/register", body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(() => {
            navigate('/login')
        })
        
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