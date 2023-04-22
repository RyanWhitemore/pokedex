import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TableContents from './TableContents'
import TableRows from './TableRows'
import Search from './Search'
import VersionCheck from './VersionCheck'

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

    const [ areaSelected, setAreaSelected ] = useState('all')

    const [ typeSelected, setTypeSelected ] = useState('all')

    const [ caughtSelected, setCaughtSelected ] = useState('all')

    const [ pokemon, setPokemon ] = useState([''])

    const [search, setSearch] = useState('')

    const [ imageUrl, setImageUrl ] = useState(null)

    /*------------------------ End initializing variables ------------------*/


    /*----------------------- Begin controller functions ---------------------*/
    

    const setVersion = async () => {
        const version = await axios.get("http://localhost:5000/version/" +
        JSON.parse(localStorage.getItem("user")).user_id)
        localStorage.setItem("version", version.data[0].version)
    }

     // Function to retrieve all pokemon data from database via api
    const getPokemon = async () => {
        
        if (!user) {
            return navigate('/')
        }
        const userID = user.user_id
        axios.defaults.baseURL = ''
        const results = await axios.get("http://localhost:5000/sort",  {
            params: {
            userID: userID,
            area: areaSelected,
            type: typeSelected,
            caught: caughtSelected,
            version: localStorage.getItem('version')
            }
        })
        const pokemon = results.data
        setPokemon(pokemon)
        
       
    }

    // Function to sort pokemon by dropdown option
    const handleDropdown = async (e) => {
        e.preventDefault()
        
        if (e.target.name === 'type') {
            setTypeSelected(e.target.value)
        }
        if (e.target.name === "caught") {
            setCaughtSelected(e.target.value)
        }
        if (e.target.name === "area") {
            setAreaSelected(e.target.value)
        }
        
        
    }

    // get profile pic from backend or get default pic
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
        setVersion();
        getPokemon();
        getProfilePic();
    }, []
    )
    
    useEffect(() => {
        async function sort() {
            console.log('sort called')
            const userID = user.user_id
            const results = await axios.get("http://localhost:5000/sort", {
                params: {
                    userID: userID,
                    area: areaSelected,
                    type: typeSelected,
                    caught: caughtSelected,
                    version: localStorage.getItem("version")
                }
            }) 

            setPokemon(results.data)
    }
    sort()
    }, [typeSelected, areaSelected, caughtSelected])

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
                <Link id="profile" className="profile" to="/profile">Profile
                </Link>
            </div>
                <h1 onClick={(e) => {
                    setAreaSelected('all')
                    setTypeSelected('all')
                    setCaughtSelected('all')
                        }
                    } id="header">Pokedex</h1>
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
                    handleDropdown={handleDropdown}
                    setAreaSelected={setAreaSelected}
                    areaSelected={areaSelected}/>
                    <TableRows pokemon={pokemon} handleChange={handleChange}/>
                </tbody>
            </table>
        </>
    )
}

export {Home}