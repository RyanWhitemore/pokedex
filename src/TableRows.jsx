import Image from "./Image"

const TableRows = ({handleChange, pokemon}) => {
    const pokemonHtml = []
    try {
        pokemon.forEach((item) => {
            try {
                item.region = item.region.replace(/,.$/, "")
            } catch (error) {
                console.log(item.region)
            }
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
    

    return pokemonHtml
}

export default TableRows