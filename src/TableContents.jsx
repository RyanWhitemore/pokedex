import Image from "./Image";
import CaughtDropdown from "./CaughtDropdown";
import TypeDropdown from "./TypeDropdown";
import AreaDropdown from "./AreaDropdown";

const TableContents = ({ areaSelected, setAreaSelected, 
    getPokemon, pokemon, setPokemon, handleDropdown, 
    caughtSelected, typeSelected }) => {

    return (
        <>
            <tr key="header0">
                <th>Picture</th>
                <th>Pokemon #</th>
                <th>Pokemon Name</th>
                <th><AreaDropdown
                    key="AreaDropdown"
                    getPokemon={getPokemon} 
                    pokemon={pokemon} 
                    setPokemon={setPokemon}
                    areaSelected={areaSelected}
                    setAreaSelected={setAreaSelected}
                    handleDropdown={handleDropdown}/></th>
                <th><TypeDropdown key={"typeDropdown"} 
                    handleDropdown={handleDropdown}
                    typeSelected={typeSelected} /></th>
                <th><CaughtDropdown key={"caughtDropdown"} 
                    handleDropdown={handleDropdown}
                    caughtSelected={caughtSelected}/></th>
            </tr>
        </>
    )

}

export default TableContents