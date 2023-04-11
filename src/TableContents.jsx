import Image from "./Image";
import CaughtDropdown from "./CaughtDropdown";
import TypeDropdown from "./TypeDropdown";
import AreaDropdown from "./AreaDropdown";

const TableContents = ({ getPokemon, pokemon, setPokemon, handleDropdown }) => {

    return (
        <>
            <tr key="0">
                <th>Picture</th>
                <th>Pokemon #</th>
                <th>Pokemon Name</th>
                <th><AreaDropdown
                getPokemon={getPokemon} 
                pokemon={pokemon} 
                setPokemon={setPokemon}/></th>
                <th><TypeDropdown handleDropdown={handleDropdown} /></th>
                <th><CaughtDropdown handleDropdown={handleDropdown}/></th>
            </tr>
        </>
    )

}

export default TableContents