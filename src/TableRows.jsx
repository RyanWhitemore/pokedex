import React from "react"
import Image from "./Image"


const TableRows = ({handleChange, pokemon, numberRows}) => {
    
    return <React.Fragment key={"fragment" + pokemon.length + 1}>
        {pokemon.slice(0, numberRows).map((pokemon, index) => {
            return (<React.Fragment key={"fragment" + index}>
                <tr value={pokemon.pokemon_id} id={pokemon.pokemon_name} key={parseInt(pokemon.pokemon_id + 1)}>
                    <td key={pokemon.pokemon_name + toString(index)}><Image key={pokemon.pokemon_name + index} name={pokemon.pokemon_name} id={pokemon.pokemon_id} /></td>
                    <td key={pokemon.pokemon_id + 'a'}>{pokemon.pokemon_id}</td>
                    <td key={pokemon.pokemon_id + 'b'}>{pokemon.pokemon_name}</td>
                    <td key={pokemon.pokemon_id + 'c'} id={"region-td"}>{pokemon.region}</td>
                    <td key={pokemon.pokemon_id + 'd'}>{pokemon.type}</td>
                    <td key={pokemon.pokemon_id + 'e'}><input type="checkbox"
                    defaultChecked={pokemon.is_caught > 0 ? "checked" : ""}
                    onChange={(e) => handleChange(pokemon.pokemon_id)}
                    /></td>
                </tr>
            </React.Fragment>)
        })}
    </React.Fragment>


}



export default TableRows
