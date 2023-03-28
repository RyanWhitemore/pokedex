import axios from 'axios';
import { react, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const LoginForm = ({setUser, user}) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    const getUserID = async (username) => {
        const userID = await axios.get("http://localhost:5000/user/" + username)
        return userID
    }

     const loginUser = async (e) => {
        e.preventDefault();

        const body = {
            username: username,
            password: password
        }
    
        axios.defaults.baseURL = ''
        axios.defaults.withCredentials = true
        const loggedIn = await axios.post("http://localhost:5000/login", body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then((response) => {return response.data})
        .catch(err => {
            throw (err)
        });
        console.log(loggedIn)
        if (loggedIn.authorized === true) {
            const userID = await getUserID(username)
            localStorage.setItem("user", JSON.stringify(userID.data))
            setUser(userID.data)
            return navigate("/home")
        } else {
            console.log('this isnt working')
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