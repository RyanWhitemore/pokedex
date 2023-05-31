import Image from "./Image"
import { FixedSizeList as List } from "react-window"

const TableRows = ({handleChange, pokemon}) => {

    return <>
        {pokemon.map(pokemon => {
            return (<>
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
                    </> )
        })}
	</>
}

export default TableRows
