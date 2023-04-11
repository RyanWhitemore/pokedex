import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TableContents from './TableContents'
import TableRows from './TableRows'
import Search from './Search'
import VersionCheck from './VersionCheck'
import ExclusiveDropdown from './AreaDropdown'

const Home = () => {

    /*------------------- Begin initializing variables -------------------*/
    const navigate = useNavigate()
    
    let user = false
    try {
        user = JSON.parse(localStorage.getItem("user"))
    }
    catch (err) {
       user = false
    }

    const [ pokemon, setPokemon ] = useState([''])

    const [search, setSearch] = useState('')

    const [ imageUrl, setImageUrl ] = useState(null)

    /*------------------------ End initializing variables ------------------*/


    /*----------------------- Begin controller functions ---------------------*/
    
     // Function to retrieve all pokemon data from database via api
    const getPokemon = async () => {
        
        if (!user) {
            return navigate('/')
        }
        const userID = user.user_id
        axios.defaults.baseURL = ''
        const results = await axios.get("http://localhost:5000/home", {
            params: {
            userID: userID
            }
        })
        const pokemon = results.data
        setPokemon(pokemon)
        
       
    }

    // Function to sort pokemon by dropdown option
    const handleDropdown = async (e) => {
        e.preventDefault()

        let results = ""

        if (e.target.value === "") {
            return getPokemon()

        }

        if (e.target.value === "uncaught") {
            results = await axios.get(
                "http://localhost:5000/uncaught/"
                + JSON.parse(localStorage.getItem("user")).user_id
                )

                return setPokemon(results.data)
        }

        if (e.target.value === "caught") {
            results = await axios.get(
                "http://localhost:5000/caught/"
                + JSON.parse(localStorage.getItem("user")).user_id
                )
            
                return setPokemon(results.data)
        }

        results = await axios.get(
            "http://localhost:5000/type/"
            + e.target.value + "/" 
            + JSON.parse(localStorage.getItem("user")).user_id
            )
        
        setPokemon(results.data)
    }


    const getProfilePic = async () => {
        const profilePic = await axios.get(`
            http://localhost:5000/profilePic/` 
            + user.user_id)
        if (!profilePic.data[0].profile_pic) {
            return setImageUrl("./profileDefault.png")
        } else {
            setImageUrl(profilePic.data[0].profile_pic)
        }
    }

    // On page load retrieve all pokemon from database
    useEffect(() => {
        getPokemon()
        getProfilePic()
        console.log(pokemon)
    }, []
    )
    

    // function to log user out
    const logout = (e) => {
        e.preventDefault()
        localStorage.setItem("user", '')
        return navigate('/')
    }


    // Function to handle search submit form
    const submitSearch = async (e) => {
        e.preventDefault()
        const userID = JSON.parse(localStorage.getItem("user")).user_id
        axios.defaults.baseURL = ""
        const results = await axios.get("http://localhost:5000/pokemon/" + search + '/' + userID)
        setPokemon(results.data)

    }

    // Function to change the caught status of pokemon when box checked
    const handleChange = async (pokemon_id) => {
        axios.defaults.withCredentials = false
        axios.put("http://localhost:5000/pokemon", {
            userID: user.user_id,
            pokemonID: pokemon_id
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Credentials": true
            }
        })
    }
    /*-------------------------- End controller functions --------------------*/

    /*--------------------------- Return final html --------------------------*/
    return (
        <>
            <div className="profile">
                <img src={imageUrl} height="100px" width="100px"/>
                <Link id="profile" className="profile" to="/profile">Profile</Link>
            </div>
                <h1 onClick={(e) => getPokemon()} id="header">Pokedex</h1>
            <VersionCheck 
                getPokemon={getPokemon}
                setPokemon={setPokemon}
                pokemon={pokemon}
            />
           <Search submitSearch={submitSearch} setSearch={setSearch}/>
            <button  id="logout" onClick={(e) => logout(e)}>logout</button>
            <table>
                <tbody>
                    <TableContents 
                    getPokemon={getPokemon}
                    pokemon={pokemon}
                    setPokemon={setPokemon}
                    handleDropdown={handleDropdown}/>
                    <TableRows pokemon={pokemon} handleChange={handleChange}/>
                </tbody>
            </table>
        </>
    )
}

export {Home}