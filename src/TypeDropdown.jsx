
const TypeDropdown = ({ handleDropdown, typeSelected}, props) => {

    const typeHtml = []
    
    const typeList = [
        "normal", "fire", "water", "grass", "electric",
        "ice", "fighting", "poison", "ground", "flying",
        "psychic", "bug", "rock", "ghost", "dark", "dragon",
        "steel", "fairy"
    ]

    typeList.forEach((type) => {
        typeHtml.push(<option key={type} value={type}>{type}</option>)
    })

    
    return (
        <>
            <div>
                <select onChange={(e) => handleDropdown(e)} name="type" 
                id="type-dropdown" className="dropdown" value={typeSelected}>
                    <option key="default" value="" defaultValue={""}>Type</option>
                    <option key="all" value="">All</option>
                    {typeHtml}
                </select>
            </div>
        </>
    )
}

export default TypeDropdown