import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



const Home = () => {


    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user"))
    
    const logout = (e) => {
        e.preventDefault()
        localStorage.setItem("user", {})
        return navigate('/login')
    }

    const submitSearch = async (e) => {
        e.preventDefault()
        const userID = JSON.parse(localStorage.getItem("user")).user_id
        axios.defaults.baseURL = ""
        const results = await axios.get("http://localhost:5000/pokemon/" + search + '/' + userID)
        setPokemon(results.data)

    }
    
    const [search, setSearch] = useState('')

    const [ pokemon, setPokemon ] = useState([''])
    const getPokemon = async () => {
        axios.defaults.baseURL = ''
        const results = await axios.get("http://localhost:5000/home", {
            params: {
                userID: JSON.parse(localStorage.getItem("user")).user_id
            }
        })
        const pokemon = results.data
        setPokemon(pokemon)
    
    }

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

    useEffect(() => {
        getPokemon()
    }, []
    )

    const typeList = [
        "normal", "fire", "water", "grass", "electric",
        "ice", "fighting", "poison", "ground", "flying",
        "psychic", "bug", "rock", "ghost", "dark", "dragon",
        "steel", "fairy"
    ]

    const typeHtml = []

    typeList.forEach((type) => {
        typeHtml.push(<option key={type} value={type}>{type}</option>)
    })

    const pokemonList = [<tr key="0">
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


    pokemon.forEach((item, index) => {
        item = [item.pokemon_id, item.pokemon_name, item.region, item.type, item.is_caught]
        pokemonList.push(
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

    return (
        <>
            <h1 onClick={(e) => getPokemon()} id="header">Pokedex</h1>
            <form onSubmit={(e) => {e.preventDefault(); submitSearch(e)}}>
                <input className='search-bar' type="text" onChange={(e) => {e.preventDefault(); setSearch(e.target.value)}} placeholder='search'/>
                <input id="search-image" type="image" src="test.png" alt='detective picachu' width="30px" height="30px"/>
            </form>
            <button  id="logout" onClick={(e) => logout(e)}>logout</button>
            <table>
                <tbody>{pokemonList}</tbody>
            </table>
        </>
    )
}

export {Home}