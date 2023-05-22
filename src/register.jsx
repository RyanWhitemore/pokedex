import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const path = "https://pokedex-project.com/api"

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    let registerUser = async (e) => {
        e.preventDefault();

        const body = {
            username: username,
            password: password
        }

        axios.defaults.baseURL = ''
        await axios.post(path + "/register", body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(() => {
            navigate('/')
        })
        
    }
    


    return (
        <>
            <h1 id="register-header">Register</h1>
            <div id="register">
                <form onSubmit={registerUser}>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} type='text'></input><br/>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='text'></input><br/>
                    <button type="submit">Register</button><br/>
                </form>
                <Link to="/">Login</Link>
            </div>
        </>
    )
}


export { Register }
