import Image from "./Image"
import { FixedSizeList as List } from "react-window"

const TableRows = ({handleChange, pokemon}) => {
    const pokemonHtml = []
    try {
        pokemon.forEach((item) => {
            item = [item.pokemon_id, item.pokemon_name, item.region, item.type, item.is_caught]
            pokemonHtml.push(
                <tr value={item[0]} key={item[0] + 1}>
                    <td><Image name={item[1]} id={item[0]} /></td>
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
    } catch (err) {
        return
    }
    

    return <div className="table-row">
        {pokemon.map(pokemon => {
            <tr value={pokemon.pokemon_id} key={pokemon.pokemon_id + 1}>
                <td><Image name={pokemon.pokemon_name} id={pokemon.pokemon_id} /></td>
                <td>{pokemon.pokemon_id}</td>
                <td>{pokemon.pokemon_name}</td>
                <td>{pokemon.region}</td>
                <td>{pokemon.type}</td>
                <td><input type="checkbox"
                defaultChecked={pokemon.is_caught > 0 ? "checked" : ""}
                onChange={(e) => handleChange(pokemon.pokemon_id)}
                /></td>
            </tr>
        })}
    </div>
}

export default TableRows