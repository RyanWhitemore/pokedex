import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



const Home = () => {

    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem("user"))
    
    const logout = (e) => {
        e.preventDefault()
        return navigate('/login')
    }
    

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

    const pokemonList = [<tr key="0">
        <th>Pokemon ID</th>
        <th>Pokemon Name</th>
        <th>Area</th>
        <th>Type</th>
        <th>Caught</th>
    </tr>]

    pokemon.forEach((item, index) => {
        item = [item.pokemon_id, item.pokemon_name, item.region, item.type, item.is_caught]
        pokemonList.push(
            <tr value={item[0]} key={item[0] + 1}>
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
            <button  onClick={(e) => logout(e)}>logout</button>
            <table>
                <tbody>{pokemonList}</tbody>
            </table>
        </>
    )
}

export {Home}