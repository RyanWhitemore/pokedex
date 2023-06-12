import axios from 'axios'
import { useEffect, useState, useCallback, Fragment } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import TableContents from './TableContents'
import TableRows from './TableRows'
import Search from './Search'
import VersionCheck from './VersionCheck'
import InfiniteScroll from 'react-infinite-scroll-component'

const Home = () => {

    const path = "http://localhost:5000"

    /*------------------- Begin initializing variables -------------------*/
    const navigate = useNavigate()
    
    let user = false
    try {
        user = JSON.parse(localStorage.getItem("user"))
    }
    catch (err) {
       user = false
    } 

    const [ moreToLoad, setMoreToLoad ] = useState(true)

    const [ numberRows, setNumberRows ] = useState(25)

    const [ areaSelected, setAreaSelected ] = useState('all')

    const [ typeSelected, setTypeSelected ] = useState('all')

    const [ caughtSelected, setCaughtSelected ] = useState('all')

    const [ pokemon, setPokemon ] = useState([''])

    const [search, setSearch] = useState('')

    const [ imageUrl, setImageUrl ] = useState(null)

    /*------------------------ End initializing variables ------------------*/


    /*----------------------- Begin controller functions ---------------------*/

    const backToTop = () => {
        const element = document.getElementsByClassName('infinite-scroll-component')
        element[0].scroll({
            top:0,
            behavior: 'smooth'
        });
    };

    const next = () => {
        console.log(numberRows)
        if (numberRows < pokemon.length) {
            setNumberRows(numberRows + 10)
        } else {setMoreToLoad(false)}
    }

    const setVersion = async () => {
        try {
            const version = await axios.get(path + "/version/" +
            JSON.parse(localStorage.getItem("user")).user_id)
            localStorage.setItem("version", version.data[0].version)
        } catch (err) {
            throw (err)
        }
    }

    // function to reset the home page

    const reset = () => {
        setAreaSelected('all')
        setTypeSelected('all')
        setCaughtSelected('all')
        getPokemon()
        setNumberRows(25)
        setMoreToLoad(true)
        backToTop()
        setSearch('')
    }


    // Function to sort pokemon by dropdown option
    const handleDropdown = async (e) => {
        e.preventDefault()
        
        try {
            if (e.target.name === 'type') {
                setTypeSelected(e.target.value)
            }
            if (e.target.name === "caught") {
                setCaughtSelected(e.target.value)
            }
            if (e.target.name === "area") {
                setAreaSelected(e.target.value)
            }
        } catch (err) {
            throw (err)
        }
        
    }


    // Function to retrieve all pokemon data from database via api
    const getPokemon = useCallback(async () => {
        if (!user) {
            return navigate('/')
        }
        const userID = user.user_id
        axios.defaults.baseURL = ''
        try {
            const results = await axios.get(path + "/sort",  {
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
        } catch (err) {
            throw (err)
        }
   
    }, [areaSelected, typeSelected, caughtSelected, navigate, user])


    // On page load retrieve all pokemon from database
    useEffect(() => {
        // get profile pic from backend or get default pic
        const getProfilePic = async () => {
            try {
                console.log("called")
                const profilePic = await axios.get(
                    path + `/profilePic/` 
                    + user.user_id)
                if (!profilePic.data[0].profile_pic) {
                    return setImageUrl("https://pokedexpictures.s3.us-east-2.amazonaws.com/defaults/profileDefault.png")
                } else {
                    setImageUrl(profilePic.data[0].profile_pic)
                }
            } catch (err) {
                console.log("there was an error")
                console.log(err)
            }
        
    
        }

        setVersion();
        getPokemon();
        getProfilePic();

    }, [user.user_id]
    )
    
    useEffect(() => {

        async function sort() {
            try {
                const userID = user.user_id
                const results = await axios.get(path +"/sort", {
                    params: {
                        userID: userID,
                        area: areaSelected,
                        type: typeSelected,
                        caught: caughtSelected,
                        version: localStorage.getItem("version")
                    }
                }) 
            
                setPokemon(results.data)
            } catch (err) {
                throw (err)
            }
    }

    sort()
        
    }, [user.user_id, typeSelected, areaSelected, caughtSelected])

    // function to log user out
    const logout = (e) => {
        e.preventDefault()
        localStorage.setItem("user", '')
        return navigate('/')
    }


    // Function to handle search submit form
    const submitSearch = async (e) => {
        try {
            e.preventDefault()
            const userID = JSON.parse(localStorage.getItem("user")).user_id
            axios.defaults.baseURL = ""
            const results = await axios.get(path + "/pokemon/" + search + '/' + userID)
            setPokemon(results.data)
            setNumberRows(1)
            setMoreToLoad(false)
            
        } catch (err) {
            throw (err)
        }
    }

    // Function to change the caught status of pokemon when box checked
    const handleChange = async (pokemon_id) => {
        try {
            axios.defaults.withCredentials = false
            axios.put(path + "/pokemon", {
                userID: user.user_id,
                pokemonID: pokemon_id
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Access-Control-Allow-Credentials": true
                }
            })
        } catch (err) {
            throw (err)
        }
    }
    /*-------------------------- End controller functions --------------------*/

    /*--------------------------- Return final html --------------------------*/
    return (
        <>
            <div id="background" className='background'>
                <div className="profile">
                    <img alt="" id={"profile-img"} src={imageUrl} height="100px" width="100px"/>
                    <Link id="profile" className="profile-link" to="/profile">{user.username}
                    </Link> <br/>
                    <button  id="logout" onClick={(e) => logout(e)}>logout</button>
                </div>
                <div id={"header"}>
                    <h1 id={"header-text"} onClick={reset}>Pokédex</h1>
                    <Search submitSearch={submitSearch} 
                        setSearch={setSearch}
                        search={search}/>
                </div>
                <div id="space"></div>
                <VersionCheck 
                    getPokemon={getPokemon}
                    setPokemon={setPokemon}
                    pokemon={pokemon}
                />
                <div id="space"></div>

                    <InfiniteScroll
                                dataLength={numberRows}
                                next={next}
                                loader={<h4>Loading</h4>}
                                hasMore={moreToLoad}
                                height={"65vh"}
                                endMessage={<button id={"back-to-top"} onClick={backToTop}>Back to Top</button>}
                        > 
                        <table id={"table"}>

                                <tbody>
                                    <TableContents 
                                    getPokemon={getPokemon}
                                    pokemon={pokemon}
                                    setPokemon={setPokemon}
                                    handleDropdown={handleDropdown}
                                    setAreaSelected={setAreaSelected}
                                    areaSelected={areaSelected}
                                    typeSelected={typeSelected}
                                    caughtSelected={caughtSelected}/>
                                    <TableRows key={"tablerows"} numberRows={numberRows}
                                        setNumberRows={setNumberRows} 
                                        pokemon={pokemon} 
                                        handleChange={handleChange}/>
                                </tbody>

                        </table>
                    </InfiniteScroll>
                </div>
        </> 
    )
}

export {Home}
