import axios from 'axios';
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = () => {
    // Initialize variables
    const path = "https://pokedex-project.com"
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ error, setError ] = useState("")


    // Function to retrieve user id from api
        const getUserID = async (username) => {
            const userID = await axios.get(path + "/user/" + username)
            return userID
        }
    
    // Function to log in user
     const loginUser = async (e) => {
        e.preventDefault();

        const body = {
            username: username,
            password: password
        }
        
        /* Api call returns {authorized: true} if credentials match 
        and {authorized: false} if they dont */
        axios.defaults.baseURL = ''
        axios.defaults.withCredentials = true
        const loggedIn = await axios.post(path + "/login", body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then((response) => {return response.data})
        .catch(err => {
            throw (err)
        });

        // if credentials matched save user info to localstorage and redirect to home
        if (loggedIn.authorized) {
            try {
                const userID = await getUserID(username)
                const version = await axios.get(
                    path + "/version/" + userID.data.user_id
                    )
                localStorage.setItem("user", JSON.stringify(userID.data))
                localStorage.setItem("auth", loggedIn)
                localStorage.setItem("version", version.data[0].version)
            } catch (err) {
                throw (err)
            }
            return navigate("/home")
        } else {
            console.log(loggedIn)
            setError("Username or password incorrect")
        }
       
    } 

    // return html for login page
    return (
        <>
            <div id="login">
                <Link id={"about"} to="/about">About</Link>
                <h1>Login</h1>
                <form onSubmit={loginUser}>
                    <input value={username} placeholder="username" 
                    onChange={(e) => setUsername(e.target.value)} 
                    type='text'></input><br/>
                    <input value={password} placeholder="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    type='password'></input><br/>
                    <button type="submit">Login</button><br/>
                </form>
                {error ? <h4 id={"error"}>{error}</h4> : ''}
                <Link to="/register">register</Link>
            </div>
        </>
    )

}

export {LoginForm}
