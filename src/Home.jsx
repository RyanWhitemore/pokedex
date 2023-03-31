import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



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

    // list of pokemon types for sort functionality
    const typeList = [
        "normal", "fire", "water", "grass", "electric",
        "ice", "fighting", "poison", "ground", "flying",
        "psychic", "bug", "rock", "ghost", "dark", "dragon",
        "steel", "fairy"
    ]

    // initialize list for type sort
    const typeHtml = []

    // initialize list for pokemon table
    const pokemonHtml = [<tr key="0">
        <th>Picture</th>
        <th>Pokemon #</th>
        <th>Pokemon Name</th>
        <th>Area</th>
        <th>
            <div>
                <select onChange={(e) => handleDropdown(e)} name="type" id="type">
                    <option key="default" value="" defaultValue={""}>Type</option>
                    <option key="all" value="">All</option>
                    {typeHtml}
                </select>
            </div>
        </th>
        <th>
            <div>
                <select onChange={(e) => handleDropdown(e)} name="caught">
                    <option key="isCaught" value=''>Caught</option>
                    <option key="caught" value="caught">Yes</option>
                    <option key="uncaught" value="uncaught">No</option>
                </select>
            </div>
        </th>
    </tr>]
    /*--------------------- End initailizing variables ---------------------*/

    /*--------------------- Begin populating html lists ------------------- */
    // create a row for each pokemon and push it to pokemonList
    pokemon.forEach((item, index) => {
        item = [item.pokemon_id, item.pokemon_name, item.region, item.type, item.is_caught]
        pokemonHtml.push(
            <tr value={item[0]} key={item[0] + 1}>
                <td><img alt={item[2]} src={"/pokemonImages/pokemon" + item[0] +".png"} width="75" height="75"/></td>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>{item[3]}</td>
                <td><input type="checkbox" 
                defaultChecked={item[4] > 0 ? "checked" : ""}
                onChange={(e) => handleChange(item[0])}
                /></td>
            </tr>
            )
    })

    // Create a dropdown option for each type
    typeList.forEach((type) => {
        typeHtml.push(<option key={type} value={type}>{type}</option>)
    })
    /*----------------------- End populating html lists ----------------------*/

    // On page load retrieve all pokemon from database
    useEffect(() => {
        getPokemon()
    }
    )

    /*----------------------- Begin controller functions ---------------------*/
    // Function to retrieve all pokemon data from database via api
    const getPokemon = async () => {
        
        if (!user) {
            return navigate('/login')
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
        
    
    

    // function to log user out
    const logout = (e) => {
        e.preventDefault()
        localStorage.setItem("user", '')
        return navigate('/login')
    }


    // Function to handle search submit form
    const submitSearch = async (e) => {
        e.preventDefault()
        const userID = JSON.parse(localStorage.getItem("user")).user_id
        axios.defaults.baseURL = ""
        const results = await axios.get("http://localhost:5000/pokemon/" + search + '/' + userID)
        setPokemon(results.data)

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
            <h1 onClick={(e) => getPokemon()} id="header">Pokedex</h1>
            <form onSubmit={(e) => {e.preventDefault(); submitSearch(e)}}>
                <input className='search-bar' type="text" onChange={(e) => {e.preventDefault(); setSearch(e.target.value)}} placeholder='search'/>
                <input id="search-image" type="image" src="test.png" alt='detective picachu' width="30px" height="30px"/>
            </form>
            <button  id="logout" onClick={(e) => logout(e)}>logout</button>
            <table>
                <tbody>{pokemonHtml}</tbody>
            </table>
        </>
    )
}

export {Home}